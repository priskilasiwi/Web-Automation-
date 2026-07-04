const { Builder, until, By } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');

const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/cartPage');
const ScreenshotPage = require('../pages/screenshotPage');
const VisualRegressionHelper = require('../utilities/visualRegressionHelper');

describe('Inventory Page Test', function () {

    // ===================== POSITIVE TEST (driver sendiri) =====================
    describe('Positive Inventory Test', function () {
        this.timeout(30000);

        let driver;
        let loginPage;
        let inventoryPage;
        let cartPage;
        let screenshotPage;
        let visualRegression;

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
        });

        afterEach(async function () {
            if (this.currentTest.state === 'failed') {
                const image = await driver.takeScreenshot();
                require('fs').writeFileSync(`failure-${Date.now()}.png`, image, 'base64');
            }
            await driver.quit();
            await new Promise(resolve => setTimeout(resolve, 1000));
        });

        it('Verify inventory page title', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Buka halaman inventory setelah login');
            await screenshotPage.takeFullScreenshot('inv_step1_page_loaded.png');
            if (!visualRegression.hasBaseline('inv_step1_page_loaded.png')) {
                visualRegression.saveAsBaseline('inv_step1_page_loaded.png');
            }
            const vr1 = visualRegression.compareImages('inv_step1_page_loaded.png');
            visualResults.push({ name: 'inv_step1_page_loaded.png', result: vr1 });

            const title = await inventoryPage.getTitle();
            steps.push(`2. Verify page title: "${title}"`);
            assert.strictEqual(title, 'Swag Labs');

            console.log('\n======================= TEST SUMMARY ===================');
            console.log('Test: Verify inventory page title');
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

        it('Verify user can add product to cart', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Klik tombol Add to Cart');
            await inventoryPage.clickAddButton();
            await screenshotPage.takeFullScreenshot('inv_step2_add_to_cart.png');
            if (!visualRegression.hasBaseline('inv_step2_add_to_cart.png')) {
                visualRegression.saveAsBaseline('inv_step2_add_to_cart.png');
            }
            const vr1 = visualRegression.compareImages('inv_step2_add_to_cart.png');
            visualResults.push({ name: 'inv_step2_add_to_cart.png', result: vr1 });

            const badgeCount = await inventoryPage.getCartBadgeCount();
            steps.push(`2. Verify cart badge count: "${badgeCount}"`);
            assert.strictEqual(badgeCount, '1');

            console.log('\n======================= TEST SUMMARY ===================');
            console.log('Test: Verify user can add product to cart');
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

        it('Verify cart badge count after adding 2 products', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Klik tombol Add to Cart untuk produk pertama');
            await inventoryPage.clickAddButton();

            steps.push('2. Klik tombol Add to Cart untuk produk kedua');
            await inventoryPage.addAnother();
            await screenshotPage.takeFullScreenshot('inv_step3_two_products.png');
            if (!visualRegression.hasBaseline('inv_step3_two_products.png')) {
                visualRegression.saveAsBaseline('inv_step3_two_products.png');
            }
            const vr1 = visualRegression.compareImages('inv_step3_two_products.png');
            visualResults.push({ name: 'inv_step3_two_products.png', result: vr1 });

            const badgeCount = await inventoryPage.getCartBadgeCount();
            steps.push(`3. Verify cart badge count: "${badgeCount}"`);
            assert.strictEqual(badgeCount, '2');

            console.log('\n======================= TEST SUMMARY ===================');
            console.log('Test: Verify cart badge count after adding 2 products');
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
    
    // ===================== NEGATIVE TEST (driver sendiri, terpisah) =====================
    describe('Negative Inventory Test', function () {
        this.timeout(30000);

        let driver;
        let inventoryPage;
        let screenshotPage;
        let visualRegression;

        before(async function () {
            driver = await new Builder().forBrowser('chrome').build();
            inventoryPage = new InventoryPage(driver);
            screenshotPage = new ScreenshotPage(driver);
            visualRegression = new VisualRegressionHelper();
        });

        beforeEach(async function () {
            await driver.manage().deleteAllCookies();
        });

        afterEach(async function () {
            if (this.currentTest.state === 'failed') {
                const image = await driver.takeScreenshot();
                require('fs').writeFileSync(`failure-${Date.now()}.png`, image, 'base64');
            }
        });

        after(async function () {
            if (driver) {
                await driver.quit();
            }
        });

        it('should redirect to login page when accessing inventory directly without login', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Akses langsung URL inventory tanpa login terlebih dahulu');
            await inventoryPage.open();
            await screenshotPage.takeFullScreenshot('neg_inv_step1_direct_access.png');
            if (!visualRegression.hasBaseline('neg_inv_step1_direct_access.png')) {
                visualRegression.saveAsBaseline('neg_inv_step1_direct_access.png');
            }
            const vr1 = visualRegression.compareImages('neg_inv_step1_direct_access.png');
            visualResults.push({ name: 'neg_inv_step1_direct_access.png', result: vr1 });

            steps.push('2. Verify user di-redirect kembali ke halaman login');
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl.includes('inventory')).to.equal(false);

            steps.push('3. Verify pesan error muncul');
            const errorElement = await driver.wait(
                until.elementLocated(By.css('[data-test="error"]')),
                5000
            );
            const errorMessage = await errorElement.getText();
            steps.push(`   Error message: "${errorMessage}"`);
            expect(errorMessage).to.equal("Epic sadface: You can only access '/inventory.html' when you are logged in.");

            console.log('\n======================= TEST SUMMARY NEGATIVE ===================');
            console.log('Test: Access inventory without login');
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

});