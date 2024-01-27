import {StepBase} from "./stepBase.js";
import {Constants} from "../utils/constants.js";
import {HomePage} from "../pages/homePage.js";
import {NavigationMenuPage} from "../pages/navigationMenuPage.js";
import {AssertionError} from "chai";
import {debugLogger} from "../utils/loggerUtil.js";
import NoSuchElementError = error.NoSuchElementError;
import {error} from "selenium-webdriver";

export class CommonSteps extends StepBase {

    public async navigateToPage(pageName: string): Promise<void> {
        if (pageName === "home") {
            await this.driver.get(Constants.SITE_URL);
        } else if (pageName === "Sign in") {
            let homePage: HomePage = new HomePage(this.driver);
            await homePage.clickSignInButton();
        } else if (pageName === "careers") {
            let homePage: HomePage = new HomePage(this.driver);
            await homePage.clickCareersLink();
        } else {
            throw new Error("Invalid page name \"" + pageName + "\"")
        }
    }

    public async validateNavigationMenuIsVisible(): Promise<void> {
        let navigationMenuPage: NavigationMenuPage = new NavigationMenuPage(this.driver);
        this.softAssert.equal(await navigationMenuPage.isNavigationMenuVisibleInViewport(), true,
            "Navigation menu is not visible.");
    }

    public async validateNavigationMenuIsNotVisible(): Promise<void> {
        let navigationMenuPage: NavigationMenuPage = new NavigationMenuPage(this.driver);
        this.softAssert.equal(await navigationMenuPage.isNavigationMenuVisibleInViewport(), false,
            "Navigation menu is visible.");
    }

    public async navigateBack(): Promise<void> {
        await this.driver.navigate().back();
    }

    public async verifyThatTheUserIsOnThePage(expectedPageLink: string): Promise<void> {
        this.softAssert.isTrue((await this.driver.getCurrentUrl()).includes(expectedPageLink),
            "The user is not on the expected page. " +
            "\nExpected Page link : " + expectedPageLink +
            "\nActual Page link : \"" + await this.driver.getCurrentUrl());
    }

    public async acceptCookies(): Promise<void> {
        let homePage: HomePage = new HomePage(this.driver);
        if (!await homePage.isCookieConsentAccepted()) {
            await homePage.clickAcceptCookies();
        }
    }

    public async scrollPage(pixels: number): Promise<void> {
        await this.driver.executeScript(`window.scrollBy(0, ${pixels});`);
    }

    public async validateSuccessfullyLoggedIn(): Promise<void> {
        let homePage: HomePage = new HomePage(this.driver);
        try {
            await homePage.isDashboardVisible();
        } catch (error) {
            if (error instanceof NoSuchElementError) {
                debugLogger.debug("Test Failed. Failed to log in.");
                throw new AssertionError("Failed to log in.");
            } else {
                throw error;
            }
        }
    }

    public async signOut(): Promise<void> {
        let homePage: HomePage = new HomePage(this.driver);
        await homePage.clickProfileButton();
        await homePage.clickSignOutButton();
        await homePage.clickSignOutFromAllAccountsButton();
    }
}