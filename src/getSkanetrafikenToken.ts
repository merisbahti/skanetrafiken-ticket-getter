import puppeteer from "puppeteer";
import { sleep } from "./sleep.js";

export const getSkanetrafikenToken = async ({
  username,
  password,
  executablePath,
}: {
  username: string;
  password: string;
  executablePath?: string;
}): Promise<string> => {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    defaultViewport: { height: 720, width: 700 },
    slowMo: 100,
  });
  const page = await browser.newPage();
  await page.goto("https://skanetrafiken.se");
  // await page.screenshot({ path: "stuff.png" });
  const cookieButton = await page.$$("#CybotCookiebotDialogBodyButtonAccept");
  await Promise.all(cookieButton.map((x) => x.click()));

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

  await page
    .$$("#submit")
    .then((xs) => xs[0])
    .then((x) => x.click());

  await sleep(1500);

  const cookies = await page.cookies();
  const jwtTokenCookie = cookies.find(
    (x) => x.name === "StarJwtTokenCookieName",
  );

  const jwtToken = (() => {
    const value = jwtTokenCookie?.value ?? "";
    const kv = value
      .split("&")
      .map((kv) => kv.split("="))
      .find(([k]) => k === "Token");
    return kv?.[1];
  })();

  await page.close();
  await browser.close();

  if (!jwtToken) throw new Error("No jwt token found");

  return jwtToken;
};
