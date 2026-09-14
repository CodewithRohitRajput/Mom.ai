import { chromium } from "patchright";

const profilePath = "./bot-profile";

export const loginIntoBrowser = async () => {
  const context = await chromium.launchPersistentContext(profilePath, {
    headless: false,
    channel: "chrome",
  });

  const page = context.pages()[0] ?? await context.newPage();

  await page.goto("https://accounts.google.com");

  await page.waitForTimeout(60000);

  await context.close();

};


export const startMeetBot = async (meetingUrl: string) => {

  const context = await chromium.launchPersistentContext(profilePath, {
    headless: true,
    channel: "chrome",
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
    ],
  });

  try {
    const page = context.pages()[0] ?? await context.newPage();

    await page.goto(meetingUrl);

    const joinBtn = page
      .getByRole("button", { name: /join now|ask to join/i })
      .first();

    await joinBtn.waitFor({ timeout: 30000 });

    await page.keyboard.press("Control+d");
    await page.keyboard.press("Control+e");

    await joinBtn.click();

    await page
      .getByRole("button", { name: /leave call/i })
      .waitFor({ timeout: 30000 });

    await page
      .getByRole("button", { name: /leave call/i })
      .waitFor({ timeout: 120000, state: "hidden" });
  } finally {
    await context.close();
  }
};