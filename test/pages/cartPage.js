const { until } = require('selenium-webdriver');
const cart_locators = require('../locators/cartPage.locator');

class CartPage {
    constructor(driver) {
        this.driver = driver;
    }

    async open() {
        await this.driver.get(cart_locators.url);
    }

    async clickCheckoutButton() {
        const checkoutButton = await this.driver.wait(
            until.elementLocated(
                cart_locators.selectors.checkoutButton
            ),
            10000
        );
        await checkoutButton.click();
    }

    async getPageTitle() {
        const title = await this.driver.wait(
            until.elementLocated(
                cart_locators.selectors.titleCart
            ),
            10000
        );
        return await title.getText();
    }

    async clickRemoveButton() {
        const removeButton = await this.driver.wait(
            until.elementLocated(
                cart_locators.selectors.removeButton
            ),
            10000
        );
        await removeButton.click();
    }
};


module.exports = CartPage;
