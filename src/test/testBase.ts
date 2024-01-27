import {WebDriver} from "selenium-webdriver";

 export async function closeMultipleTabs(driver: WebDriver) {
    let openedTabs: string[]  = await driver.getAllWindowHandles();
    try {
        if (openedTabs .length > 1) {
            for (let i: number = openedTabs.length; i > 1; i--) {
                await driver.switchTo().window(openedTabs [i - 1]);
                await driver.close();
            }
        }
    } finally {
        await driver.switchTo().window(openedTabs [0]);
    }
}