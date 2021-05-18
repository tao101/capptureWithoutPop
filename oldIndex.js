const puppeteer = require("puppeteer-extra");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin());

const URL_TO_TEST = "https://www.youtube.com/watch?v=aT2haaX-kXw";

(async () => {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // cleaning cookies just in case we alredy accepted the use of cookies before
  const client = await page.target().createCDPSession();
  await await client.send("Network.clearBrowserCookies");

  await page.goto(URL_TO_TEST, {
    //waiting until the page fully loades before doing anything
    waitUntil: "domcontentloaded",
  });

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

  const term = "Consent";
  const buttons = await page.$x("//a[contains(., Consent)]");
  //console.log(buttons);
  if (buttons.length > 0) {
    console.log("found button");
    await buttons[0].click();
  }

  await page.screenshot({
    path: "screenshot.png",
    fullPage: true,
  });
  await browser.close();
})();
