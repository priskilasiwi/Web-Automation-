const { until } = require('selenium-webdriver');
const login_locators = require('../locators/loginPage.locator');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async open() {
        await this.driver.get(login_locators.url);
    }

    async enterUsername(username) {
    const usernameInput = await this.driver.wait(
        until.elementLocated(login_locators.selectors.usernameInput),
        10000
    );

    await usernameInput.click();
    await usernameInput.clear();
    await usernameInput.sendKeys(username);

    const value = await usernameInput.getAttribute('value');
    console.log('USERNAME FIELD:', value);
}

    async enterPassword(password) {
        const passwordInput = await this.driver.wait(
        until.elementLocated(login_locators.selectors.passwordInput),
        10000
    );

    await passwordInput.click();
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    }

    async clickLoginButton() {
        const loginButton = await this.driver.wait(
        until.elementLocated(
            login_locators.selectors.loginButton
        ),
        10000
    );

    await loginButton.click();
    }   

    async getErrorMessage() {
        const errorMessageElement = await this.driver.wait (
            until.elementLocated(login_locators.selectors.errorMessage),
            5000
        );
        return await errorMessageElement.getText();
    }

    async getTitle() {
    const el = await this.driver.findElement(login_locators.selectors.title);
    return el.getText();
    }

    async getInventoryTitle() {
    const el = await this.driver.findElement(login_locators.selectors.inventoryTitle);
    return el.getText();
    }
};


module.exports = LoginPage;
