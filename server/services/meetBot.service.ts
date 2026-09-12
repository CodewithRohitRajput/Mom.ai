import { chromium } from "playwright";

export const meetBot = async (meetLink: string) => {

    const browser = await chromium.launch({
        headless: false
    })

    const context = await browser.newContext()

    const page = await context.newPage()

    await page.goto(meetLink)

    console.log("Meet link opened")

    await page.waitForTimeout(30000)

    await browser.close()
}

await meetBot("https://meet.google.com/gci-khjq-qzt")