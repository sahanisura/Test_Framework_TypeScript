import {Builder, WebDriver} from "selenium-webdriver";
import {CommonSteps} from "../steps/commonSteps.js";
import {afterEach} from "mocha";
import {CareersPageSteps} from "../steps/careersPageSteps.js";
import {SoftAssert} from "../utils/softAssert.js";
import {infoLogger} from "../utils/loggerUtil.js";
import {Constants} from "../utils/constants.js";
import {closeMultipleTabs} from "./testBase.js";

describe("Careers page tests", function () {
    this.timeout(Constants.MOCHA_TIMEOUT)
    let driver: WebDriver;
    let softAssert: SoftAssert;
    let commonSteps: CommonSteps;
    let careersPageSteps: CareersPageSteps;

    before("before", async function (): Promise<void> {
        infoLogger.info("______________before______________");
        driver = await new Builder().forBrowser(Constants.BROWSER).build();
        await driver.manage().window().maximize();
    })

    beforeEach("beforeEach", async function (): Promise<void> {
        infoLogger.info(this.test?.title);
        softAssert = new SoftAssert();
        commonSteps = new CommonSteps(driver, softAssert);
        careersPageSteps = new CareersPageSteps(driver, softAssert);
    });

    afterEach("afterEach", async function (): Promise<void> {
        infoLogger.info(this.test?.title);
        await closeMultipleTabs(driver);
        // await driver.quit();
    });

    after("after", async function (): Promise<void> {
        infoLogger.info("______________after______________");
        await driver.quit();
    });

    it("Validate header section", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("careers");
        await careersPageSteps.validateHeadingText("Come build the home for all developers");
        await careersPageSteps.validateParagraphText("Do the best work of your career and " +
            "join in our mission to accelerate human progress by connecting communities all over " +
            "the world through software collaboration.");
        await commonSteps.validateNavigationMenuIsVisible();
        await commonSteps.scrollPage(1500);
        await commonSteps.validateNavigationMenuIsNotVisible();
        softAssert.assertAll();
    });

    /* As Validate header section, tests should be added to validate features section, utility section
    and above section. But it's better to validate static content/text at lower layers of the test pyramid */

    it("Validate engineering positions filtering", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("careers");
        await careersPageSteps.click0penPositionsButton();
        await commonSteps.acceptCookies();
        await careersPageSteps.filterOpenPositionsBy("Categories", "Engineering");
        await careersPageSteps.filterOpenPositionsBy("Remote", "Yes");
        await careersPageSteps.validateFilteredPositions([
            {
                positionIndex: "0",
                positionName: "Senior Software Engineer, Copilot Platform",
                reqId: "2640",
                location: "Remote, Germany",
                categories: "Engineering"
            },
            {
                positionIndex: "1",
                positionName: "Principal Software Engineer",
                reqId: "2526",
                location: "Remote, United States",
                categories: "Engineering"
            },
            {
                positionIndex: "2",
                positionName: "Software Engineer, Internal Development Experience",
                reqId: "2484",
                location: "Remote, United Kingdom",
                categories: "Engineering"
            },
            {
                positionIndex: "5",
                positionName: "Senior Software Engineer, CodeQL Experiences",
                reqId: "2590",
                location: "Remote, United Kingdom",
                categories: "Engineering"
            }
        ]);
        softAssert.assertAll();
    });

    it("Validate Principal Software Engineer position and apply", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("careers");
        await careersPageSteps.click0penPositionsButton();
        await commonSteps.acceptCookies();
        await careersPageSteps.filterOpenPositionsBy("Categories", "Engineering");
        await careersPageSteps.expandPositionDescription("Principal Software Engineer");
        await careersPageSteps.validateJobSummary("About GitHub\n" +
            "\n" +
            "As the global home for all developers, GitHub is the complete AI-powered developer platform to build, " +
            "scale, and deliver secure software. Over 100 million people, including developers from 90 of the " +
            "Fortune 100 companies, use GitHub to build amazing things together across 330\\+ million repositories. " +
            "With all the collaborative features of GitHub, it has never been easier for individuals and teams to " +
            "write faster, better code.\n" +
            "\n" +
            "Locations\n" +
            "\n" +
            "In this .*");
        await careersPageSteps.clickReadMoreButton();
        await commonSteps.verifyThatTheUserIsOnThePage("https://www.github.careers/jobs/2526?");
        await commonSteps.navigateBack();
        await careersPageSteps.scrollToThePosition("Principal Software Engineer");
        await careersPageSteps.clickApplyNowButton();
        await commonSteps.verifyThatTheUserIsOnThePage("https://careers-githubinc.icims.com/jobs/2526/login?");
        softAssert.assertAll();
    });
})