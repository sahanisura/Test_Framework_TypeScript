import {WebDriver} from "selenium-webdriver";
import {SoftAssert} from "../utils/softAssert.js";

export class StepBase {
    protected driver: WebDriver;
    protected softAssert: SoftAssert;

    constructor(driver: WebDriver, softAssert: SoftAssert) {
        this.driver = driver;
        this.softAssert = softAssert;
    }
}