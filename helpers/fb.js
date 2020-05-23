const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const cookies = require('../cookies.json');
const axios = require('axios');

require('dotenv').config();

const { FB_USERNAME, FB_PASSWORD, FB_TOKEN } = process.env;

const getEventData = async (url) => {
	try {
		const { data } = await getEvent(url);
		return data;
	} catch (error) {
		try {
			await likeEvent(url);
			const { data } = await getEvent(url);
			return data;
		} catch (error) {
			return error;
		}
	}
}

const getEvent = (url) => {
  const eventId = getEventId(url);
  const FIELDS = [ 'name', 'cover', 'attending_count', 'interested_count', 'description', 'start_time', 'end_time', 'place', 'ticket_uri' ];
  const requestUrl = `https://graph.facebook.com/${eventId}?fields=${FIELDS}&access_token=${FB_TOKEN}`;
  return axios.get(requestUrl);
};

const getEventId = (url) => {
  const lastChar = url[url.length - 1];
  const array = url.split('/');
  if (lastChar === '/') array.pop();
  return array[array.length - 1];
}

const likeEvent = async (url) => {
  const eventId = getEventId(url);
  const mobileUrl = `https://m.facebook.com/events/${eventId}`;

  const ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--single-process',
  ];

  const OPTIONS = {
    ARGS,
    headless: true,
  };

  const browser = await puppeteer.launch(OPTIONS);
  const page = await browser.newPage();
  // await page.setViewport({ width: 800, height: 600 })

  if (Object.keys(cookies).length) {
    console.log('setting cookies', cookies);
    await page.setCookie(...cookies);
  } else {
    await loginToFacebook(page);
  }

  await goToEventAndClickInterested(mobileUrl, page);
  await page.waitFor(2000);
  browser.close();
};

const goToEventAndClickInterested = async (mobileUrl, page) => {
  await page.goto(mobileUrl, { waitUntil: 'networkidle2' });
  const links = await page.$x("//a[contains(., 'Interested')]");
  await links[0].click();
};

const loginToFacebook = async (page) => {
  try {
    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle0' });
  } catch (error) {
    console.log('error navigating to Facebook login');
  }
  console.log('logging in to Facebook with user', FB_USERNAME);
  await page.type('#email', FB_USERNAME, { delay: 1 });
  await page.type('#pass', FB_PASSWORD, { delay: 1 });
  await page.click('#loginbutton');
  await page.waitFor(5000);
  await writeCookies(page);
}

const writeCookies = async (page) => {
  const currentCookies = await page.cookies();
  fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
}

module.exports = {
  getEventData,
  getEventId,
};
