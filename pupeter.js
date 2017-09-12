const puppeteer = require('puppeteer');
const fs = require('fs');

const openAuctionPage = async (browser, auction_number) => {
  const page = await browser.newPage();
  await page.goto('https://www.copart.com/todaysAuction/',{'waitUntil':'networkidle'});
  const arg = await page.$$(".joinsearch");
  arg[auction_number].click();
  await page.waitForNavigation();
  // await page.waitFor(30*1000);

  const frame = page.frames()[2];
  await frame.waitForSelector(".view-header-icon-leave-label");
  await frame.injectFile("inject.js");
  await frame.waitForFunction("window.auction_end_result != null",{"timeout":60*60*1000});

  const data = await frame.evaluate(() => {return auction_end_result;});
  fs.appendFile("dump/"+(new Date()).getDate()+"_"+auction_number+".csv", JSON.stringify(data), 'utf8', (err) => {return console.log("Error in file write: ",err);});
};

(async() => {
  // "executablePath":"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
  const browser = await puppeteer.launch({"headless":false});
  const page = await browser.newPage();
  await page.goto('https://www.copart.com/todaysAuction/',{'waitUntil':'networkidle'});

  const arg = await page.$$(".joinsearch");
  console.info("Found auctions size list: ", arg.length);

  for (i = 0; i < arg.length && i < 5; i++) {
    openAuctionPage(browser, i);
  }

})();
