const {By} = require('selenium-webdriver');

//Locators untuk halaman Cart Sauce Demo
const cart_locators = {
    url: 'https://www.saucedemo.com/cart.html',

    selectors: {  
        checkoutButton: By.id('checkout'),
        titleCart: By.css('[data-test="title"]'),
        removeButton: By.id('remove-sauce-labs-backpack'),
        shoppingCartBadge: By.className('shopping_cart_badge')
    }
};

module.exports = cart_locators;