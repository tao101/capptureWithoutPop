const puppeteer = require("puppeteer-extra");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

const URL_TO_TEST =
  "https://www.euronews.com/2021/05/17/lockdown-begins-to-lift-in-uk-amid-worries-over-indian-variant";

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const adblocker = AdblockerPlugin({
  blockTrackers: true,
  useCache: true, // default: false
});
puppeteer.use(adblocker);

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // Visit a page, ads are blocked automatically!
  const client = await page.target().createCDPSession();
  await await client.send("Network.clearBrowserCookies");
  await page.goto(URL_TO_TEST, {
    //waiting until the page fully loades before doing anything
    waitUntil: "domcontentloaded",
  });

  await page.waitForTimeout(5 * 1000);

  //closing all page dialogs / popups built using js
  page.on("dialog", async (dialog) => {
    //console.log(dialog.message());
    await dialog.dismiss();
  });

  // now we need to close dialog / popup made using pure html
  //console.log("trying to find button");

  //gree is the word in the popup Agree
  //here we can get the lang from the html of the website to get the website language  (<html lang="en">)
  // and search for the terms in that langauge like agree or accept or i understand
  // for now we look only for gree for this example or you can set your own term

  const term = "gree";
  const buttons = await page.$x("//span[contains(., gree)]");
  //console.log(buttons);
  if (buttons.length > 0) {
    console.log("found button");
    await buttons[0].click();
  }

  await page.screenshot({ path: "test.png", fullPage: true });

  console.log(`All done, check the screenshots. ✨`);
  await browser.close();
});
