import {CommonSteps} from "../steps/commonSteps.js";
import {Builder, WebDriver} from "selenium-webdriver";
import {afterEach} from "mocha";
import {LoginPageSteps} from "../steps/loginPageSteps.js";
import {SoftAssert} from "../utils/softAssert.js";
import {infoLogger} from "../utils/loggerUtil.js";
import {Constants} from "../utils/constants.js";
import {closeMultipleTabs} from "./testBase.js";

describe("Login flow tests ", function () {
    this.timeout(Constants.MOCHA_TIMEOUT)
    let driver: WebDriver;
    let softAssert: SoftAssert;
    let commonSteps: CommonSteps;
    let loginPageSteps: LoginPageSteps;

    before("before", async function (): Promise<void> {
        infoLogger.info("______________before______________");
        driver = await new Builder().forBrowser(Constants.BROWSER).build();
        await driver.manage().window().maximize();
    })

    beforeEach("before each", async function (): Promise<void> {
        infoLogger.info(this.test?.title);
        softAssert = new SoftAssert();
        commonSteps = new CommonSteps(driver, softAssert);
        loginPageSteps = new LoginPageSteps(driver, softAssert);
    });

    afterEach("after each", async function (): Promise<void> {
        infoLogger.info(this.test?.title);
        await closeMultipleTabs(driver);
        // await driver.quit();
    });

    after("after", async function (): Promise<void> {
        infoLogger.info("______________after______________");
        await driver.quit();
    });

    it("Validate login page elements", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.validateLogoIsVisible();
        await loginPageSteps.validateUsernameOrEmailAddressFieldAppearance();
        await loginPageSteps.validatePasswordFieldAppearance();
        await loginPageSteps.validateForgotYourPasswordText();
        await loginPageSteps.validateSignInButtonText();
        await loginPageSteps.validateSignInWithAPasskeyText();
        await loginPageSteps.validateCreateAnAccountText("New to GitHub? Create an account");
        softAssert.assertAll();
    });

    it("Login with valid email and valid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("validEmail@gmail.com");
        await loginPageSteps.enterPassword("validPassword");
        await loginPageSteps.clickLoginButton();
        await commonSteps.validateSuccessfullyLoggedIn();
        await commonSteps.signOut();
    });

    it("Login with valid email and invalid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("validEmail@gmail.com");
        await loginPageSteps.enterPassword("invalidPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with valid email and without password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("validEmail@gmail.com");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email and valid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidEmail@gmail.com");
        await loginPageSteps.enterPassword("validPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email and invalid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidEmail@gmail.com");
        await loginPageSteps.enterPassword("invalidPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email and without password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidEmail@gmail.com");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login without email and valid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterPassword("validPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login without email and invalid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterPassword("invalidPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login without email and without password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email format and valid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidFormat");
        await loginPageSteps.enterPassword("validPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email format and invalid password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidFormat");
        await loginPageSteps.enterPassword("invalidPassword");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });

    it("Login with invalid email format and without password", async function (): Promise<void> {
        await commonSteps.navigateToPage("home");
        await commonSteps.navigateToPage("Sign in");
        await loginPageSteps.enterEmail("invalidFormat");
        await loginPageSteps.clickLoginButton();
        await loginPageSteps.validateErrorMessage("Incorrect username or password.");
        softAssert.assertAll();
    });
});