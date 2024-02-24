import puppeteer from "puppeteer";
const username = Bun.env["USERNAME"];
const password = Bun.env["PASSWORD"];
const executablePath = Bun.env["EXECUTABLE_PATH"];

if (!username || !password || !executablePath)
  throw new Error("Both `USERNAME` and `PASSWORD` need to be defined in en`");

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath,
  defaultViewport: { height: 720, width: 700 },
  slowMo: 100,
});
const page = await browser.newPage();
await page.goto("https://skanetrafiken.se");
// await page.screenshot({ path: "stuff.png" });
const cookieButton = await page.$$("#CybotCookiebotDialogBodyButtonAccept");
await Promise.all(cookieButton.map((x) => x.click()));
console.log("cookie button clicked");

const loginButton = await page.$$(
  ".st-header__main__top__action.st-header__main__top__action--has-background",
);

// await page.screenshot({ path: "example.png" });
await Promise.all(loginButton.map((x) => x.click()));

const myAccountButton = await page
  .$$(".st-menu-dropdown__list__item__link")
  .then((x) => x[0]);

await sleep(200);
await myAccountButton.click();

// await page.screenshot({ path: "ss1.png" });

await page
  .$$("#email")
  .then((xs) => xs[0])
  .then((x) => x.type(username));

await sleep(500);

await page
  .$$("#password")
  .then((xs) => xs[0])
  .then((x) => x.type(password));

await sleep(500);

// await page.screenshot({ path: "ss2.png" });

await page
  .$$("#submit")
  .then((xs) => xs[0])
  .then((x) => x.click());

console.log("taking screenshot");
// await page.screenshot({ path: "ss3.png" });

await sleep(1500);

const cookies = await page.cookies();
const jwtTokenCookie = cookies.find((x) => x.name === "StarJwtTokenCookieName");

console.log(jwtTokenCookie);

const jwtToken = (() => {
  const value = jwtTokenCookie?.value ?? "";
  const kv = value
    .split("&")
    .map((kv) => kv.split("="))
    .find(([k, _]) => k === "Token");
  return kv?.[1];
})();

console.log(jwtToken);

console.log(
  await fetch("https://www.skanetrafiken.se/gw-bns/registered-app", {
    headers: { Authorization: `Bearer ${jwtToken}` },
  }).then((x) => x.json()),
);

// await page.screenshot({ path: "example.png" });
await page.close();
await browser.close();
