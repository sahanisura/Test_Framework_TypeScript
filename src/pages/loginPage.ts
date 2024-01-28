import {PageBase} from "./pageBase.js";
import {By, WebDriver} from "selenium-webdriver";

export class LoginPage extends PageBase {
    private usernameOrEmailAddressLbl: By = By.css("[for=\"login_field\"]");
    private usernameOrEmailAddressTxt: By = By.id("login_field");
    private passwordLbl: By = By.css("[for=\"password\"]");
    private passwordTxt: By = By.id("password");
    private signInBtn: By = By.className("js-sign-in-button");
    private forgotPasswordLnk: By = By.id("forgot-password");
    private signInWithAPasskeyLbl: By = By.css(".login-callout .Button-label");
    private createAnAccountLbl: By = By.className("mt-1");
    private logo: By = By.className("header-logo");
    private errorLbl: By = By.css("#js-flash-container [role=\"alert\"]");

    constructor(driver: WebDriver) {
        super(driver);
    }

    public async isLogoVisible(): Promise<boolean> {
        return (await this.waitUntilElementIsLocated(this.logo)).isDisplayed();
    }

    public async isUsernameOrEmailAddressLabelVisible(): Promise<boolean> {
        return await this.driver.findElement(this.usernameOrEmailAddressLbl).isDisplayed();
    }

    public async getUsernameOrEmailAddressLabelText(): Promise<string> {
        return await this.driver.findElement(this.usernameOrEmailAddressLbl).getText();
    }

    public async isPasswordLabelVisible(): Promise<boolean> {
        return await this.driver.findElement(this.passwordLbl).isDisplayed();
    }

    public async getPasswordLabelText(): Promise<string> {
        return await this.driver.findElement(this.passwordLbl).getText();
    }

    public async getSignInButtonText(): Promise<string> {
        return await (await this.waitUntilElementIsLocatedAndDisplayed(this.signInBtn)).getAttribute("value");
    }

    public async getForgetPasswordText(): Promise<string> {
        return await (await this.waitUntilElementIsLocatedAndDisplayed(this.forgotPasswordLnk)).getText();
    }

    public async getSignInWithAPasskeyText(): Promise<string> {
        return await (await this.waitUntilElementIsLocatedAndDisplayed(this.signInWithAPasskeyLbl)).getText();
    }

    public async getCreateAnAccountLblText(): Promise<string> {
        return await (await this.waitUntilElementIsLocatedAndDisplayed(this.createAnAccountLbl)).getText();
    }

    public async enterEmail(email: string): Promise<void> {
        await (await this.waitUntilElementIsLocatedAndDisplayed(this.usernameOrEmailAddressTxt))
            .sendKeys(email);
    }

    public async enterPassword(password: string): Promise<void> {
        await (await this.waitUntilElementIsLocatedAndDisplayed(this.passwordTxt))
            .sendKeys(password);
    }

    public async clickLoginButton(): Promise<void> {
        await (await this.waitUntilElementIsLocatedAndDisplayed(this.signInBtn)).click();
    }

    public async getErrorMessage(): Promise<string> {
        return await (await this.waitUntilElementIsLocatedAndDisplayed(this.errorLbl)).getText();
    }
}