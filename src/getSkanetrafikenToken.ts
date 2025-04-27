import puppeteer from "puppeteer";
import { sleep } from "./sleep.ts";

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
     headless: false,
    executablePath,
    defaultViewport: { height: 720, width: 700 },
    slowMo: 20,
  });
  const page = await browser.newPage();
  await page.goto("https://www.skanetrafiken.se/mitt-konto#/");
  // await page.screenshot({ path: "stuff.png" });

  console.log("finding and clicking the cookie button");
  
  const cookieButton = await page.$$("#CybotCookiebotDialogBodyButtonAccept");
  await Promise.all(cookieButton.map((x) => x.click()));


  console.log("finding and clicking the login button");
  


  console.log("filling email");
  
  await page
    .$$("#email")
    .then((xs) => xs[0])
    .then((x) => x.type(username));

  await sleep(200);

  console.log("filling password");

  await page
    .$$("#password")
    .then((xs) => xs[0])
    .then((x) => x.type(password));

  await sleep(200);


  console.log("finding and clicking the login button");

     await page.screenshot({ path: "ss1.png" });
  // get console logs from browser
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
      consoleLogs.push(msg.text());
  });

  await page
    .$$(".st-login-form__actions #submit")
    .then((xs) => xs[0])
    .then((x) => x.click());

  await sleep(1500);
  await page.screenshot({ path: "ss1.png" });


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
