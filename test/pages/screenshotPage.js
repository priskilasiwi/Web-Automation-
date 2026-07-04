const path = require('path');
const fs = require('fs');

class ScreenshotPage {
  constructor(driver) {
    this.driver = driver;
    this.screenshotDir = path.join(__dirname, '..', '..', 'screenshot');
  }

  async takeFullScreenshot(filename) {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(this.screenshotDir, filename);
    const screenshot = await this.driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`Full screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async takeElementScreenshot(selector, filename) {
    const { By } = require('selenium-webdriver');

    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    const element = await this.driver.findElement(By.css(selector));
    const screenshotPath = path.join(this.screenshotDir, filename);
    const screenshot = await element.takeScreenshot(true);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    console.log(`Element screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }
}

module.exports = ScreenshotPage;