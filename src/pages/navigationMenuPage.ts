import {PageBase} from "./pageBase.js";
import {Actions, By, WebDriver, WebElement} from "selenium-webdriver";

export class NavigationMenuPage extends PageBase {
    private navigationMenu: By = By.className("header-menu-wrapper");
    private solutionsMenuItem: By = By.xpath("//button[contains(text(),'Solutions')]");

    constructor(driver: WebDriver) {
        super(driver);
    }

    public async moveMousePointerToSolutionsMenuItem(): Promise<void> {
        let elementMenu: WebElement = await this.driver.findElement(this.solutionsMenuItem);
        const actions: Actions = this.driver.actions({async: true});
        await actions.move({origin: elementMenu}).perform();
    }

    public async isNavigationMenuVisibleInViewport(): Promise<boolean> {
        let script: string =
            "var elem = arguments[0],                           " +
            "  box = elem.getBoundingClientRect(),      " +
            "  cx = box.left + box.width / 2,           " +
            "  cy = box.top + box.height / 2,           " +
            "  efp = document.elementFromPoint(cx, cy); " +
            "for (; elem; elem = elem.parentElement) {  " +
            "  if (elem === efp) return true;           " +
            "}                                          " +
            "return false;                              ";

        return Boolean(await this.driver.executeScript(script, this.driver.findElement(this.navigationMenu)));
    }
}