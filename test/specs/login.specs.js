const {Builder} = require('selenium-webdriver');
const LoginPage = require('../pages/loginPage');
const login_locators = require('../locators/loginPage.locator');
const {expect} = require('chai');
const VisualRegressionHelper = require('../utilities/visualRegressionHelper');
const ScreenshotPage = require('../pages/screenshotPage');

describe('Login Page Tests Sauce Demo', () => {

    const testCases = {
        valid: { 
            username: 'standard_user', 
            password: 'secret_sauce', 
        },
        invalidUsername: { 
            username: 'invalid_user', 
            password: 'invalid_password', 
            expectedErrorMessage: 'Epic sadface: Username and password do not match any user in this service' 
        },
        wrongPassword: {
            username: 'standard_user',
            password: 'wrong_password'
        },
        lockedOut: {
            username: 'locked_out_user',
            password: 'secret_sauce'
        } 
    };

    // ===================== POSITIVE TEST (driver sendiri) =====================
    describe('Positive Login Test', function () {
        this.timeout(30000);
        let driver;
        let loginPage;
        let screenshotPage;
        let visualRegression;

        before(async function () {
            driver = await new Builder().forBrowser('chrome').build();
            loginPage = new LoginPage(driver);
            screenshotPage = new ScreenshotPage(driver);
            visualRegression = new VisualRegressionHelper();
        });

        beforeEach(async function () {
            await driver.manage().deleteAllCookies();
            await loginPage.open();
        });

        after(async function () {
            if (driver) {
                await driver.quit();
            }
        });

        it('should login successfully with valid credentials', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Open Login page (https://www.saucedemo.com/)');
            await screenshotPage.takeFullScreenshot('step1_login_page.png');
            if (!visualRegression.hasBaseline('step1_login_page.png')) {
                visualRegression.saveAsBaseline('step1_login_page.png');
            }
            const vr1 = visualRegression.compareImages('step1_login_page.png');
            visualResults.push({ name: 'step1_login_page.png', result: vr1 });

            await loginPage.enterUsername(testCases.valid.username);
            steps.push(`2. Enter username: ${testCases.valid.username}`);

            await loginPage.enterPassword(testCases.valid.password);
            steps.push(`3. Enter Password: ${testCases.valid.password.replace(/./g, '*')}`);

            await loginPage.clickLoginButton();
            steps.push('4. Click Login Button');
            await screenshotPage.takeFullScreenshot('step2_after_login.png');
            if (!visualRegression.hasBaseline('step2_after_login.png')) {
                visualRegression.saveAsBaseline('step2_after_login.png');
            }
            const vr2 = visualRegression.compareImages('step2_after_login.png');
            visualResults.push({ name: 'step2_after_login.png', result: vr2 });

            await driver.sleep(500);
            const title = await loginPage.getInventoryTitle();
            steps.push(`5. Verify page title: "${title}" `);

            if (title !== 'Products') {
                throw new Error(`Expected title "Products" but got "${title}"`);
            }
            await screenshotPage.takeFullScreenshot('step3_Validasi_assertion.png');
            const vr3 = visualRegression.compareImages('step3_Validasi_assertion.png');
            visualResults.push({ name: 'step5_Validasi_assertion.png', result: vr3 });

            console.log('\n======================= TEST SUMMARY ===================');
            console.log('Test: Login with credential');
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
    describe('Negative Login Test', function () {
        this.timeout(30000);
        let driver;
        let loginPage;
        let screenshotPage;
        let visualRegression;

        before(async function () {
            driver = await new Builder().forBrowser('chrome').build();
            loginPage = new LoginPage(driver);
            screenshotPage = new ScreenshotPage(driver);
            visualRegression = new VisualRegressionHelper();
        });

        beforeEach(async function () {
            await driver.manage().deleteAllCookies();
            await loginPage.open();
        });

        after(async function () {
            if (driver) {
                await driver.quit();
            }
        });

        it('should display error message for invalid credentials', async function () {
            const steps = [];
            const visualResults = [];

            steps.push('1. Open Login page (https://www.saucedemo.com/)');
            await screenshotPage.takeFullScreenshot('neg_step1_login_page.png');
            if (!visualRegression.hasBaseline('neg_step1_login_page.png')) {
                visualRegression.saveAsBaseline('neg_step1_login_page.png');
            }
            const negativeVr1 = visualRegression.compareImages('neg_step1_login_page.png');
            visualResults.push({ name: 'neg_step1_login_page.png', result: negativeVr1 });

            await loginPage.enterUsername(testCases.invalidUsername.username);
            steps.push(`2. Enter username: ${testCases.invalidUsername.username}`);

            await loginPage.enterPassword(testCases.invalidUsername.password);
            steps.push(`3. Enter Password: ${testCases.invalidUsername.password.replace(/./g, '*')}`);

            await loginPage.clickLoginButton();
            steps.push('4. Click Login Button');
            await screenshotPage.takeFullScreenshot('neg_step2_after_login.png');
            if (!visualRegression.hasBaseline('neg_step2_invalid_username.png')) {
                visualRegression.saveAsBaseline('neg_step2_invalid_username.png');
            }
            const vr2 = visualRegression.compareImages('neg_step2_invalid_username.png');
            visualResults.push({ name: 'neg_step2_invalid_username.png', result: vr2 });

            const errorMessage = await loginPage.getErrorMessage();
            steps.push(`5. Verify error message: "${errorMessage}"`);
            expect(errorMessage).to.equal(testCases.invalidUsername.expectedErrorMessage);

            console.log('\n======================= TEST SUMMARY NEGATIVE ===================');
            console.log('Test: Login with invalid credential');
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