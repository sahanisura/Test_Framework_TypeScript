import {StepBase} from "./stepBase.js";
import {WebDriver} from "selenium-webdriver";
import {CareersPage} from "../pages/careersPage.js";
import {SoftAssert} from "../utils/softAssert.js";

export class CareersPageSteps extends StepBase {
    private careersPage: CareersPage;

    constructor(driver: WebDriver, softAssert: SoftAssert) {
        super(driver, softAssert);
        this.careersPage = new CareersPage(this.driver);
    }

    public async validateHeadingText(expectedHeadingText: string): Promise<void> {
        let actualHeadingText: string = await this.careersPage.getHeadingText();
        this.softAssert.equal(actualHeadingText, expectedHeadingText);
    }

    public async validateParagraphText(expectedParagraphText: string): Promise<void> {
        let actualParagraphText = await this.careersPage.getParagraphText();
        const pattern: RegExp = new RegExp("^" + expectedParagraphText + "$");
        this.softAssert.isTrue(pattern.test(actualParagraphText),
            "Actual and expected values do not match. " +
            "\nExpected : " + expectedParagraphText +
            "\nActual : " + actualParagraphText);
    }

    public async click0penPositionsButton(): Promise<void> {
        await this.careersPage.click0penPositionsButton();
    }

    public async filterOpenPositionsBy(filterCriterion: string, value: string): Promise<void> {
        if (filterCriterion === "Locations") {
            await this.careersPage.clickLocationsFilter();
        } else if (filterCriterion === "Categories") {
            await this.careersPage.clickCategoriesFilter();
        } else if (filterCriterion === "Type") {
            await this.careersPage.clickTypeFilter();
        } else if (filterCriterion === "Management Level") {
            await this.careersPage.clickManagementLevelFilter();
        } else if (filterCriterion === "Remote") {
            await this.careersPage.clickRemoteFilter();
        } else {
            throw new Error("Invalid filter criterion: " + filterCriterion);
        }

        await this.careersPage.filterOpenPositionsBy(value);
    }

    public async validateFilteredPositions(expectedPositionsDetailList: {
        positionIndex: string;
        positionName: string;
        reqId: string;
        location: string;
        categories: string
    }[]): Promise<void> {
        let visiblePositionsDetails: {
            positionName: string;
            reqId: string;
            location: string;
            categories: string}[]
            = await this.careersPage.getVisiblePositionsDetails();

        for (const expectedPositionDetail of expectedPositionsDetailList) {
            let index: number = parseInt(expectedPositionDetail.positionIndex);
            let actualPositionDetailsMap = visiblePositionsDetails[index];

            this.softAssert.equal(actualPositionDetailsMap.positionName, expectedPositionDetail.positionName,
                "The expected Position Name of Position Index "
                + expectedPositionDetail.positionIndex +
                " does not match the actual Position Name.");

            this.softAssert.equal(actualPositionDetailsMap.reqId, expectedPositionDetail.reqId,
                "The expected Req ID of Position Index "
                + expectedPositionDetail.positionIndex +
                " does not match the actual Req ID.");

            this.softAssert.equal(actualPositionDetailsMap.location, expectedPositionDetail.location,
                "The expected Location of Position Index "
                + expectedPositionDetail.positionIndex +
                " does not match the actual Location.");

            this.softAssert.equal(actualPositionDetailsMap.categories, expectedPositionDetail.categories,
                "The expected Category of Position Index "
                + expectedPositionDetail.positionIndex +
                " does not match the actual Category.");
        }
    }

    public async validateJobSummary(expectedJobSummaryText: string): Promise<void> {
        let actualJobSummaryText: string = await this.careersPage.getJobSummaryText();
        const pattern: RegExp = new RegExp("^" + expectedJobSummaryText + "$")
        this.softAssert.isTrue(pattern.test(actualJobSummaryText),
            "Actual and expected values do not match. " +
            "\nExpected : " + expectedJobSummaryText +
            "\nActual : " + actualJobSummaryText);
    }

    public async expandPositionDescription(position: string) {
        await this.careersPage.expandPositionDescription(position);
    }

    public async clickReadMoreButton() {
        await this.careersPage.clickReadMoreButton();
    }

    public async clickApplyNowButton() {
        await this.careersPage.clickApplyNowButton();
    }

    public async scrollToThePosition(position: string) {
        await this.careersPage.scrollToThePosition(position);
    }
}