import {PageBase} from "./pageBase.js";
import {By, error, WebDriver, WebElement} from "selenium-webdriver";
import NoSuchElementError = error.NoSuchElementError;
import {Constants} from "../utils/constants.js";

export class HomePage extends PageBase {
    private signInBtn: By = By.className("HeaderMenu-link--sign-in");
    private careersLnk: By = By.linkText("Careers");
    private acceptCookiesBtn: By = By.id("cookie-consent-accept-button");
    private dashboard: By = By.id("dashboard");
    private profileBtn: By = By.className("AppHeader-user");
    private signOutBtn: By = By.css("[href=\"/logout\"]");
    private signOutFromAllAccountsBtn: By = By.css("[value=\"Sign out from all accounts\"]");
    private cookiesConsentLbl: By = By.id("pixel-consent-container");

    //Other locators on the home page should be added here

    constructor(driver: WebDriver) {
        super(driver);
    }

    public async clickSignInButton(): Promise<void> {
        await this.driver.findElement(this.signInBtn).click();
    }

    public async clickCareersLink(): Promise<void> {
        await this.driver.findElement(this.careersLnk).click();
    }

    public async clickAcceptCookies(): Promise<void> {
        await (await this.waitUntilElementIsDisplayed(this.driver.findElement(this.acceptCookiesBtn))).click();
    }

    public async isCookieConsentAccepted(): Promise<boolean> {
        try {
            return await this.driver.findElement(this.cookiesConsentLbl).getAttribute("style")
                === "display: none;";
        } catch (error) {
            if (error instanceof NoSuchElementError) {
                return true;
            } else {
                throw error;
            }
        }
    }

    public async isDashboardVisible(): Promise<Boolean> {
        return await this.driver.findElement(this.dashboard).isDisplayed();
    }

    public async clickProfileButton(): Promise<void> {
        await (await this.waitUntilElementIsLocatedAndDisplayed(this.profileBtn)).click();
    }

    public async clickSignOutButton(): Promise<void> {
        await this.driver.wait(async () => {
                try {
                    await this.driver.findElement(this.signOutBtn).click();
                    return true
                } catch (error) {
                    return false;
                }
            }, Constants.WAIT_TIMEOUT_IN_MILLISECONDS,
            "Timed out after " + Constants.WAIT_TIMEOUT_IN_MILLISECONDS +
            " milliseconds. Sign out Button is not clickable within the specified time.",
            Constants.POLLING_INTERVAL_IN_MILLISECONDS)
    }

    public async clickSignOutFromAllAccountsButton(): Promise<void> {
        await (await this.waitUntilElementIsLocatedAndDisplayed(this.signOutFromAllAccountsBtn)).click();
    }

    //Other home page actions should be added here
}