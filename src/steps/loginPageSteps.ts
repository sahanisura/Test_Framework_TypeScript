import {StepBase} from "./stepBase.js";
import {LoginPage} from "../pages/loginPage.js";
import {WebDriver} from "selenium-webdriver";
import {SoftAssert} from "../utils/softAssert.js";

export class LoginPageSteps extends StepBase {
    private loginPage: LoginPage;

    constructor(driver: WebDriver, softAssert: SoftAssert) {
        super(driver, softAssert);
        this.loginPage = new LoginPage(this.driver);
    }

    public async validateLogoIsVisible(): Promise<Promise<void>> {
        this.softAssert.equal(await this.loginPage.isLogoVisible(), true,
            "Logo is not visible.");
    }

    public async validateUsernameOrEmailAddressFieldAppearance(): Promise<void> {
        this.softAssert.equal(await this.loginPage.isUsernameOrEmailAddressLabelVisible(), true,
            "Username or email address label is not visible.");
        this.softAssert.equal(await this.loginPage.getUsernameOrEmailAddressLabelText(), "Username or email address",
            "Username or email address label is incorrect.");
    }

    public async validatePasswordFieldAppearance(): Promise<void> {
        this.softAssert.equal(await this.loginPage.isPasswordLabelVisible(), true,
            "Password label is not visible.");
        this.softAssert.equal(await this.loginPage.getPasswordLabelText(), "Password",
            "Password Label is incorrect.");
    }

    public async validateSignInButtonText(): Promise<void> {
        this.softAssert.equal(await this.loginPage.getSignInButtonText(), "Sign in",
            "Sign in button text is incorrect.");
    }

    public async validateSignInWithAPasskeyText(): Promise<void> {
        this.softAssert.equal(await this.loginPage.getSignInWithAPasskeyText(), "Sign in with a passkey",
            "Sign in with a passkey text is incorrect.");
    }

    public async validateForgotYourPasswordText(): Promise<void> {
        this.softAssert.equal(await this.loginPage.getForgetPasswordText(), "Forgot password?",
            "Password reset link text is incorrect.");
    }

    public async validateCreateAnAccountText(expectedText: string): Promise<Promise<void>> {
        this.softAssert.equal(await this.loginPage.getCreateAnAccountLblText(), expectedText,
            "Create an account text is incorrect.");
    }

    public async enterEmail(email: string): Promise<void> {
        await this.loginPage.enterEmail(email);
    }

    public async enterPassword(password: string): Promise<void> {
        await this.loginPage.enterPassword(password);
    }

    public async clickLoginButton(): Promise<void> {
        await this.loginPage.clickLoginButton();
    }

    public async validateErrorMessage(expectedErrorMessage: string): Promise<void> {
        let actualErrorMessage: string = (await this.loginPage.getErrorMessage()).trim();
        this.softAssert.equal(actualErrorMessage, expectedErrorMessage);
    }
}