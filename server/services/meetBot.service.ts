import { chromium } from "playwright";

export const startMeetBot = async (meetLink: string) => {

    const browser = await chromium.launch({
        headless: false,
        channel: "chrome"
    });

    const context = await browser.newContext({
        permissions: []
    });

    const page = await context.newPage();

    console.log("Opening Google Meet...");

    await page.goto(meetLink, {
        waitUntil: "domcontentloaded"
    });

    console.log("Meet opened");

    // Wait for Meet to load
    await page.waitForTimeout(5000);

    // Click "Continue without microphone and camera"
    const continueButton = page.getByText(
        "Continue without microphone and camera",
        { exact: true }
    );

    if (await continueButton.isVisible()) {
        console.log("Turning microphone and camera off...");
        await continueButton.click();
    }

    // Wait for the pre-join screen
    await page.waitForTimeout(3000);

    // Click Join now
    const joinButton = page.getByRole("button", {
        name: /Join now/i
    });

    if (await joinButton.isVisible()) {
        console.log("Joining meeting...");
        await joinButton.click();

        console.log("BOT JOINED MEETING 🚀");
    } else {
        console.log("Join button not found");
    }

    // Keep bot inside meeting
    await page.waitForTimeout(60000);

    await browser.close();
};

await meetBot("https://meet.google.com/gci-khjq-qzt")