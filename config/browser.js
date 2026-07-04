const BROWSER = {
  // Browser yang digunakan untuk testing
    name: "chrome",

 // Chrome options untuk headed/headless mode
 options: {
    headless: true,
    args: [
      "--disable-gpu",
      "--window-size=1920,1080",
        "--no-sandbox",
        "--disable-dev-shm-usage",
    ]

},

 //untuk headed mode (visible browser)
 headed: {
    headless: false,
    args: [
        "--window-size=1920,1080"
    ]
  }

}

module.exports = BROWSER;

