const { until } = require('selenium-webdriver');
const inventory_locators = require('../locators/inventoryPage.locator');

class InventoryPage {
    constructor(driver) {
        this.driver = driver;
    }

    async open() {
        await this.driver.get(inventory_locators.url);
    }

    async clickAddButton() {
    const addButton = await this.driver.wait(
        until.elementLocated(
            inventory_locators.selectors.addToCartButton
        ),
        10000
    );

    await addButton.click();
    }

    async getTitle() {
    const logo = await this.driver.findElement(
        inventory_locators.selectors.inventoryTitle
    );

    return await logo.getText();
    }

    async clickShoppingCart() {
    const cartButton = await this.driver.wait(
        until.elementLocated(inventory_locators.selectors.shoppingCartLink), 10000
    );
    await cartButton.click();
    }

    async getCartBadgeCount() {
    const badge = await this.driver.findElement(
        inventory_locators.selectors.shoppingCartBadge 
    );
    return await badge.getText();
    }

    async addAnother() {
        const addAnotherItem = await this.driver.findElement(
            inventory_locators.selectors.addanotherToCartButton
        );
        await addAnotherItem.click();
    }

    async getTitleCart() {
    const logo = await this.driver.findElement(
        inventory_locators.selectors.titleCart
    );

    return await logo.getText();
    }
};


module.exports = InventoryPage;
