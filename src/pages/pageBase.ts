import {By, until, WebDriver, WebElement} from "selenium-webdriver";
import {Constants} from "../utils/constants.js";

export class PageBase {
    protected driver: WebDriver;

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    protected async waitUntilElementIsLocated(locator: By): Promise<WebElement> {
        return this.driver.wait(until.elementLocated(locator),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Element not found within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);
    }

    protected async waitUntilElementsAreLocated(locator: By): Promise<WebElement[]> {
        return await this.driver.wait(until.elementsLocated(locator),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Elements not found within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);
    }

    protected async waitUntilChildElementIsLocated(parentElement: WebElement, locator: By): Promise<WebElement | undefined> {
        return await this.driver.wait(async () => {
                try {
                    return await parentElement.findElement(locator);
                } catch (error) {
                    return undefined;
                }
            }, Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Child element not found within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);
    }

    protected async waitUntilElementIsDisplayed(element: WebElement): Promise<WebElement> {
        return this.driver.wait(until.elementIsVisible(element),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Element not visible within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);
    }

    protected async waitUntilChildElementIsDisplayed(webElement: WebElement, locator: By): Promise<WebElement> {
        return this.driver.wait(until.elementIsVisible(webElement.findElement(locator)),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Child element not visible within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);
    }

    protected async waitUntilElementIsLocatedAndDisplayed(locator: By): Promise<WebElement> {
        let element: WebElement = this.driver.wait(until.elementLocated(locator),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Element not found within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);

        return await this.waitUntilElementIsDisplayed(element);
    }

    protected async waitUntilElementsAreLocatedAndDisplayed(locator: By): Promise<WebElement[]> {
        let elements: WebElement[] = await this.driver.wait(until.elementsLocated(locator),
            Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Elements not found within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS);

        for (const webElement of elements) {
            await this.waitUntilElementIsDisplayed(webElement)
        }

        return elements;
    }

    protected async waitUntilElementsAreNotDisplayed(webElementList: WebElement[]): Promise<void> {
        for (const webElement of webElementList) {
            await this.driver.wait(until.elementIsNotVisible(webElement),
                Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
                "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
                " milliseconds. Elements did not become invisible within the specified time.",
                Constants.POLLING_INTERVAL_IN_MILLISECONDS);
        }
    }

    protected async scrollToTheElement(element: WebElement): Promise<void> {
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);

        //Custom wait is used to wait until scrolling is complete.
        await this.driver.wait(async () => {
            let elementYCoordinate: number = Math.floor((await element.getRect()).y);
            let windowYCoordinate: number = Number(await this.driver.executeScript("return window.scrollY;"));
            if (elementYCoordinate == windowYCoordinate) {
                return element;
            }
            return null;
        });
    }
}