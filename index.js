const puppeteer = require("puppeteer");

const URL_TO_TEST = "https://rusvesna.su/";

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

  console.log("trying to find button");
  //gree is the word in the popup Agree
  //here we can get the lang from the html of the website to get the website language  (<html lang="en">)
  // and search for the terms in that langauge like agree or accept or i understand
  // for now we look only for gree for this example
  const buttons = await page.$x("//a[contains(., 'закрыть')]");
  console.log(buttons);
  if (buttons.length > 0) {
    console.log("found button");
    await buttons[0].click();
  }

  await page.screenshot({ path: URL_TO_TEST.slice(0, 20), fullPage: true });
  await browser.close();
})();
