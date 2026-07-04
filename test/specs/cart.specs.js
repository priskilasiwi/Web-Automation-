const { Builder, until, By } = require('selenium-webdriver');
const assert = require('assert');

const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CartPage = require('../pages/cartPage');
const ScreenshotPage = require('../pages/screenshotPage');
const VisualRegressionHelper = require('../utilities/visualRegressionHelper');

describe('Cart Page Test', function () {
    let driver;
    let loginPage;
    let inventoryPage;
    let cartPage;
    let screenshotPage;
    let visualRegression;

    this.timeout(30000);

    beforeEach(async function () {
        let retries = 2;
        while (retries > 0) {
            try {
                driver = await new Builder().forBrowser('chrome').build();
                break;
            } catch (err) {
                console.log('Gagal buka browser, retry...', err.message);
                retries--;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        loginPage = new LoginPage(driver);
        inventoryPage = new InventoryPage(driver);
        cartPage = new CartPage(driver);
        screenshotPage = new ScreenshotPage(driver);
        visualRegression = new VisualRegressionHelper();

        await loginPage.open();
        await loginPage.enterUsername('standard_user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLoginButton();

        await driver.wait(async () => (await driver.getCurrentUrl()).includes('inventory'), 10000);
        await inventoryPage.clickAddButton();
        await inventoryPage.clickShoppingCart();
        await driver.wait(async () => (await driver.getCurrentUrl()).includes('cart'), 10000);
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            const image = await driver.takeScreenshot();
            require('fs').writeFileSync(`failure-${Date.now()}.png`, image, 'base64');
        }
        await driver.quit();
        await new Promise(resolve => setTimeout(resolve, 1000)); // jeda 1 detik
    });

    it('should display the correct title in the cart page', async function () {
        const steps = [];
        const visualResults = [];

        steps.push('1. Buka halaman cart setelah menambahkan produk');
        await screenshotPage.takeFullScreenshot('cart_step1_page_loaded.png');
        if (!visualRegression.hasBaseline('cart_step1_page_loaded.png')) {
            visualRegression.saveAsBaseline('cart_step1_page_loaded.png');
        }
        const vr1 = visualRegression.compareImages('cart_step1_page_loaded.png');
        visualResults.push({ name: 'cart_step1_page_loaded.png', result: vr1 });

        const title = await cartPage.getPageTitle();
        steps.push(`2. Verify page title: "${title}"`);
        assert.strictEqual(title, 'Your Cart');

        console.log('\n======================= TEST SUMMARY ===================');
        console.log('Test: Verify cart page title');
        console.log('Status : PASSED');
        console.log('\n Steps executed');
        steps.forEach(step => console.log(`  ${step}`));
        console.log('\nVisual Regression Result: ');
        visualResults.forEach(vr => {
            if (!vr.result.hasBaseline) {
                console.log(`  [NEW] ${vr.name} - Baseline Created`);
            } else if (vr.result.match) {
                console.log(` [PASS] ${vr.name} - Match: ${vr.result.matchPercentage}%`);
            } else {
                console.log(` [FAIL] ${vr.name} - Match: ${vr.result.matchPercentage}%`);
            }
            console.log('============================\n');
        });
    });

    it('should navigate to the checkout page when clicking the checkout button', async function () {
        const steps = [];
        const visualResults = [];

        steps.push('1. Klik tombol Checkout di halaman cart');
        await cartPage.clickCheckoutButton();

        await driver.wait(async () => (await driver.getCurrentUrl()).includes('checkout-step-one'), 10000);
        await screenshotPage.takeFullScreenshot('cart_step2_checkout_page.png');
        if (!visualRegression.hasBaseline('cart_step2_checkout_page.png')) {
            visualRegression.saveAsBaseline('cart_step2_checkout_page.png');
        }
        const vr1 = visualRegression.compareImages('cart_step2_checkout_page.png');
        visualResults.push({ name: 'cart_step2_checkout_page.png', result: vr1 });

        const currentUrl = await driver.getCurrentUrl();
        steps.push(`2. Verify URL contains "checkout-step-one": ${currentUrl}`);
        assert.strictEqual(currentUrl.includes('checkout-step-one'), true);

        console.log('\n======================= TEST SUMMARY ===================');
        console.log('Test: Navigate to checkout page from cart');
        console.log('Status : PASSED');
        console.log('\n Steps executed');
        steps.forEach(step => console.log(`  ${step}`));
        console.log('\nVisual Regression Result: ');
        visualResults.forEach(vr => {
            if (!vr.result.hasBaseline) {
                console.log(`  [NEW] ${vr.name} - Baseline Created`);
            } else if (vr.result.match) {
                console.log(` [PASS] ${vr.name} - Match: ${vr.result.matchPercentage}%`);
            } else {
                console.log(` [FAIL] ${vr.name} - Match: ${vr.result.matchPercentage}%`);
            }
            console.log('============================\n');
        });
    });

});