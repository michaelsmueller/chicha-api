const puppeteer = require('puppeteer');
const fs = require('fs');
const cookies = require('../cookies.json');
const axios = require('axios');

require('dotenv').config();

const { FB_USERNAME, FB_PASSWORD, FB_TOKEN } = process.env;

const getAndReturnEvent = async (url) => {
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
  const requestUrl = `https://graph.facebook.com/${eventId}?access_token=${FB_TOKEN}`;
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
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  if (Object.keys(cookies).length) await page.setCookie(...cookies);
  else await loginToFacebook();
  await goToEventAndClickInterested(mobileUrl, page);
  await page.waitFor(1000);
  browser.close();
};

const goToEventAndClickInterested = async (mobileUrl, page) => {
  await page.goto(mobileUrl, { waitUntil: 'networkidle2' });
  const links = await page.$x("//a[contains(., 'Interested')]");
  await links[0].click();
};

const loginToFacebook = async () => {
  await page.goto('https://www.facebook.com/login/', { waitUntil: 'networkidle0' });
  await page.type('#email', FB_USERNAME, { delay: 1 });
  await page.type('#pass', FB_PASSWORD, { delay: 1 });
  await page.click('#loginbutton');
  await page.waitFor(2000);
  await writeCookies(page);
}

const writeCookies = async (page) => {
  const currentCookies = await page.cookies();
  fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
}

module.exports = {
  getAndReturnEvent,
};
