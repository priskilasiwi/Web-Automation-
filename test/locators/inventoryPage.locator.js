const {By} = require('selenium-webdriver');

//Locators untuk halaman inventory Sauce Demo
const inventory_locators = {
    url: 'https://www.saucedemo.com/inventory.html',

    selectors: {  
        inventoryTitle: By.className('app_logo'),
        addToCartButton: By.id('add-to-cart-sauce-labs-backpack'),
        addanotherToCartButton: By.id('add-to-cart-sauce-labs-bike-light'),
        shoppingCartLink: By.className('shopping_cart_link'),
        shoppingCartBadge: By.className('shopping_cart_badge'),
        titleCart: By.css('[data-test="title"]')
    }
};

module.exports = inventory_locators;