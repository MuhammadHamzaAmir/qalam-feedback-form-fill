const puppeteer = require("puppeteer");
require("dotenv").config();
(async () => {

    //browser starting
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ["--start-maximized"],
    }); 

    //creating an incognito browser
    const context = await browser.createIncognitoBrowserContext();
    var page = await context.newPage(); 

    /***when headless = true Comment out the following code**/
    // await page.setViewport({
    //     width: 1920,
    //     height: 1080,
    //     deviceScaleFactor: 1,
    //   });
    // await page.setDefaultNavigationTimeout(0);
    
    //our credentials
    var id = process.env.ID;
    var pass = process.env.PASS;
    
    //our script starts now 
    await page.goto("https://qalam.nust.edu.pk/");
    await page.setDefaultNavigationTimeout(0);
    await page.waitForTimeout(3500);     //delay of 3.5 seconds

    //login
    await login(id,pass,page);
    await page.waitForTimeout(5500);    //delay of 5.5 seconds


    
    
    
    await browser.close();
})();

//login function
let login = async (id,pass,page) =>{

    await page.type("#login", id, { delay: 69 });      //entering id
    await page.waitForTimeout(420);     //delay of 0.42 secs
    await page.type("#password", pass, { delay: 69 });      //entering password
    await page.waitForTimeout(100);     //delay of 0.1 secs
    await page.click("button[type='submit']");       //clicking the login button
    
}