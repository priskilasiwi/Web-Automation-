const {By} = require('selenium-webdriver');

//Locators untuk halaman login Sauce Demo
const login_locators = {
    url: 'https://www.saucedemo.com/',

    selectors: {
        usernameInput: By.id('user-name'),
        passwordInput: By.id('password'),
        loginButton: By.id('login-button'),
        errorMessage: By.css('[data-test="error"]'),
        loginTitle: By.className('login_logo'),    
        inventoryTitle: By.className('title'),
        addToCartButton: By.id('add-to-cart-sauce-labs-backpack'),
        shoppingCartBadge: By.className('shopping_cart_link'),
        checkoutButton: By.id('checkout')
    }
};

module.exports = login_locators;