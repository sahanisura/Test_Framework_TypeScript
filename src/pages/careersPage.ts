import {PageBase} from "./pageBase.js";
import {Actions, By, error, Key, WebDriver, WebElement} from "selenium-webdriver";
import NoSuchElementError = error.NoSuchElementError;
import {debugLogger} from "../utils/loggerUtil.js";

export class CareersPage extends PageBase {
    private clickedPositionName!: string;
    private heading: By = By.css(".clearfix .h2-mktg");
    private paragraph: By = By.css(".clearfix .f3");
    private openPositionsLnk: By = By.linkText("Open positions");
    private locationsFilter: By = By.id("location-filter");
    private categoriesFilter: By = By.id("category-filter");
    private typeFilter: By = By.xpath("//mat-label[text()='Type']/ancestor::*[7]");
    private managementLevelFilter: By = By.xpath("//mat-label[text()='Management Level']/ancestor::*[7]");
    private remoteFilter: By = By.xpath("//mat-label[text()='Remote']/ancestor::*[7]");
    private filterValues: By = By.className("mat-option-text");
    private searchResultsIndicator: By = By.id("search-results-indicator");
    private openPositions: By = By.css(".job-results-container .search-result-item");

    constructor(driver: WebDriver) {
        super(driver);
    }

    public async getHeadingText(): Promise<string> {
        return (await this.waitUntilElementIsLocated(this.heading)).getText();
    }

    public async getParagraphText(): Promise<string> {
        return (await this.waitUntilElementIsLocated(this.paragraph)).getText();
    }

    public async click0penPositionsButton(): Promise<void> {
        await (await this.waitUntilElementIsLocated(this.openPositionsLnk)).click();
    }

    public async clickLocationsFilter(): Promise<void> {
        await this.driver.findElement(this.locationsFilter).click();
    }

    public async clickCategoriesFilter(): Promise<void> {
        await this.driver.findElement(this.categoriesFilter).click();
    }

    public async clickTypeFilter(): Promise<void> {
        await this.driver.findElement(this.typeFilter).click();
    }

    public async clickManagementLevelFilter(): Promise<void> {
        await this.driver.findElement(this.managementLevelFilter).click();
    }

    public async clickRemoteFilter(): Promise<void> {
        await this.driver.findElement(this.remoteFilter).click();
    }

    public async filterOpenPositionsBy(value: string): Promise<void> {
        let filterValuesList: WebElement[] = await this.waitUntilElementsAreLocated(this.filterValues);

        let filterValueElement: WebElement | undefined;
        for (const element of filterValuesList) {
            let elementText = await element.getText();
            if (value === elementText.substring(0, elementText.indexOf("(") - 1)) {
                filterValueElement = element;
                break;
            }
        }

        if (filterValueElement !== undefined) {
            await filterValueElement.click();
        } else {
            throw new NoSuchElementError("Filter value with name " + value + " not found");
        }

        const actions: Actions = this.driver.actions({async: true});
        await actions.sendKeys(Key.ESCAPE).perform();

        await this.waitUntilFilteringIsCompleted();
    }

    public async getVisiblePositionsDetails(): Promise<{
        positionName: string;
        reqId: string;
        location: string;
        categories: string}[]> {
        let openPositionsList: WebElement[] =
            await this.driver.findElements(this.openPositions);

        let visiblePositionsDetailsArray: {
            positionName: string;
            reqId: string;
            location: string;
            categories: string} [] = [];

        for (const element of openPositionsList) {
            if (await element.isDisplayed()) {
                visiblePositionsDetailsArray.push({
                    positionName: await element.findElement(By.className("job-title")).getText(),
                    reqId: (await element.findElement(By.className("req-id")).getText()).replaceAll(/[^0-9]/g, ""),
                    location: (await element.findElement(By.className("location")).getText()).replace("\n", ""),
                    categories: await element.findElement(By.className("categories")).getText()
                })
            }
        }

        return visiblePositionsDetailsArray;
    }

    public async expandPositionDescription(position: string) {
        await this.scrollToThePosition(position);
        let element = await (await this.getPosition(position))
            .findElement(By.className("mat-expansion-indicator"));
        await element.click();
        this.clickedPositionName = position;
    }

    public async getJobSummaryText(): Promise<string> {
        await this.checkClickedPositionNameNotNull();
        let clickedPosition: WebElement = await this.getPosition(this.clickedPositionName);
        let jobDescription: string = await (await this.waitUntilChildElementIsDisplayed(
            clickedPosition, By.css("div.inner-html-description")))
            .getText();
        return jobDescription.substring(0, jobDescription.indexOf("Overview")).trim();
    }

    public async clickReadMoreButton(): Promise<void> {
        await this.checkClickedPositionNameNotNull();
        let clickedPosition: WebElement = await this.getPosition(this.clickedPositionName);
        let readMoreWebElement: WebElement | undefined =
            await this.waitUntilChildElementIsLocated(clickedPosition, By.linkText("Read More"));

        if (readMoreWebElement !== undefined) {
            return readMoreWebElement.click();
        } else {
            throw new NoSuchElementError("Read More button not found")
        }
    }

    public async clickApplyNowButton(): Promise<void> {
        await this.checkClickedPositionNameNotNull();
        let clickedPosition: WebElement = await this.getPosition(this.clickedPositionName);
        await clickedPosition.findElement(By.linkText("Apply Now")).click();
    }

    public async scrollToThePosition(position: string) {
        let element: WebElement = await this.getPosition(position);
        await this.scrollToTheElement(element);
    }

    private async checkClickedPositionNameNotNull(): Promise<void> {
        if (this.clickedPositionName === undefined) {
            throw new Error("clickedPositionName is null. Click on the position before you perform this action");
        }
    }

    private async getPosition(positionName: string): Promise<WebElement> {
        let openPositionsArray: WebElement[] = await this.waitUntilElementsAreLocatedAndDisplayed(this.openPositions);
        let position: WebElement | undefined;

        debugLogger.info("openPositionsArray length = " + openPositionsArray.length)

        for (const webElement of openPositionsArray) {
            if ((await webElement.findElement(By.className("job-title")).getText()) === positionName) {
                position = webElement;
                break;
            }
        }

        if (position !== undefined) {
            return position;
        } else {
            throw new NoSuchElementError("Position with name " + positionName + " not found");
        }
    }

    private async waitUntilFilteringIsCompleted(): Promise<void> {
        await this.waitUntilElementIsLocated(this.searchResultsIndicator);
    }
}