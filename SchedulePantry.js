const playwright = require("playwright");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();



chromium.use(stealth);

const userAgentStrings = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
];

async function ScheduleAppointment({page}) {
  await page
      .locator("div")
      .filter({ hasText: "Schedule New Shopping Appointment" })
      .nth(2)
      .click();

    await page.waitForTimeout(5000); // wait for 5 seconds
    await page.locator("#PickupDates").selectOption({ index: 1 });
    await page.waitForTimeout(5000); // wait for 2 seconds
    await page
      .getByRole("button", { name: "Set Shopping Appointment Date and Time" })
      .click();

    // check for confirmation
    const deleteLink = await page.getByRole("link", { name: "Delete" });
 
}

async function SchedulePantry() {
  const browser = await chromium.launch({
    headless: false, // setting this to true will not run the UI
  });

  const storageFilePath = path.join(__dirname, "niner.json");
  const storageState = JSON.parse(fs.readFileSync(storageFilePath, "utf8"));

  const context = await browser.newContext({
    storageState,
    userAgent:
      userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
  });

  const page = await context.newPage();
  await page.waitForTimeout(10000); // wait for 5 seconds

  await page.goto(
    "https://charlotte.foodpantryhelper.com/ClientServices/CreateScheduledPickup"
  );

  await page.waitForTimeout(10000); // wait for 5 seconds

  // check if cookies expired and redirected to login
  const element = await page.$('text=Web Authentication @ Charlotte');
  const deleteLink = await page.getByRole("link", { name: "Delete" });
  if (await element?.isVisible()){
    await page.screenshot({ path: path.join(__dirname, "expiredCookies.png") });
    if(process.env.BOT_TOKEN){
    const bot = new TelegramBot(process.env.BOT_TOKEN)
    bot.sendPhoto(process.env.CHAT_ID, path.join(__dirname, "expiredCookies.png"),{caption: 'Cookies Expired'});
    }
  }

  else if (await deleteLink?.isVisible()) {
    await page.screenshot({ path: path.join(__dirname, "alreadyScheduled.png") });
    console.log(process.env.BOT_TOKEN)
    if(process.env.BOT_TOKEN){
      console.log('Already Scheduled')
    const bot = new TelegramBot(process.env.BOT_TOKEN)
    bot.sendPhoto(process.env.CHAT_ID, path.join(__dirname, "alreadyScheduled.png"),{caption: 'Already Scheduled'});
    }
  } else {
   
    let retries = 10;

    while(retries > 0){
    await ScheduleAppointment({page});
    // check for confirmation
    const deleteLink = await page.getByRole("link", { name: "Delete" });
    if (await deleteLink?.isVisible()) {
      await page.screenshot({ path: path.join(__dirname, "confirmation.png") });
      if(process.env.BOT_TOKEN){
        const bot = new TelegramBot(process.env.BOT_TOKEN)
        bot.sendPhoto(process.env.CHAT_ID,{ path: path.join(__dirname, "confirmation.png") },{caption: 'Booking Confirmed'});
        }
      retries = 0;
      break;
    }
  }
    
  }

  await context.close();
  await browser.close();
}


module.exports = {
  SchedulePantry
};
