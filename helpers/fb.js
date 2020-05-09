const puppeteer = require('puppeteer');
const fs = require('fs');
const cookies = require('../cookies.json');
const axios = require('axios');

require('dotenv').config();

const { FB_USERNAME, FB_PASSWORD, FB_TOKEN } = process.env;

const likeEvent = async (url) => {
  const eventId = getEventId(url);
  const mobileURL = `https://m.facebook.com/events/${eventId}`;
  console.log('likeEvent passed url', url);
  console.log('event id', eventId);
  console.log('mobile event URL', mobileURL);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  if (Object.keys(cookies).length) {
    await page.setCookie(...cookies);
  } else {
    await page.goto('https://www.facebook.com/login/', { waitUntil: 'networkidle0' });
    await page.type('#email', FB_USERNAME, { delay: 1 });
    await page.type('#pass', FB_PASSWORD, { delay: 1 });
    await page.click('#loginbutton');
    await page.waitFor(2000); // 1500 is too fast
    const currentCookies = await page.cookies();
    console.log('currentCookies', currentCookies);
    fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
  }
  await page.goto(mobileURL, { waitUntil: 'networkidle2' });
  const links = await page.$x("//a[contains(., 'Interested')]");
  await links[0].click();
  await page.waitFor(1000);
  return 'success';
};

const getEventId = (url) => {
  const lastChar = url[url.length - 1];
  const array = url.split('/');
  if (lastChar === '/') array.pop();
  return array[array.length - 1];
}

const getEvent = (url) => {
  const eventId = getEventId(url);
  const requestURL = `https://graph.facebook.com/${eventId}?access_token=${FB_TOKEN}`;
  console.log('requesting URL', requestURL);
  return axios.get(requestURL);
};

module.exports = {
  likeEvent,
  getEvent,
};
