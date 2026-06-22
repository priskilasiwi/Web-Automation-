const {Builder, By, until} = require ('selenium-webdriver');
const assert = require ('assert');
const {Select} = require('selenium-webdriver/lib/select');

describe ('Google Search Test', function () {
    let driver;

    it('Visit SauceDemo dan cek page title', async function (){
        driver = await new Builder().forBrowser('chrome').build();

        await driver.get('https://www.saucedemo.com');

        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]') )
        let buttonLogin = await driver.findElement(By.className("submit-button btn_action"))
        await inputUsername.sendKeys("standard_user")
        await driver.sleep(500);
        await inputPassword.sendKeys("secret_sauce")
        await driver.sleep(500);
        await buttonLogin.click()

        let title = await driver.getTitle()
        assert.strictEqual(title, 'Swag Labs');

        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
        10000
        );
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Shopping cart harus tampil');
        await buttonCart.isDisplayed();

        const actions = driver.actions({async: true});
        let dropdownSort = await driver.findElement(By.xpath('//select[@data-test="product-sort-container"]'));
        let sortZtoA = await driver.findElement(By.xpath('//option[@value="za"]'));
        
        await dropdownSort.click();
        await actions.move({origin: dropdownSort}).perform();  // kursor gerak ke dropdown
        await driver.sleep(1000);

        let select = new Select(dropdownSort);
        await select.selectByVisibleText('Name (Z to A)');
        await driver.sleep(1000);

        await driver.quit();
          
    })
    
})