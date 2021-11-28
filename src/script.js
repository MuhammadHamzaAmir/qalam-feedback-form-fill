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
    
    //our credentials
    var id = process.env.ID;
    var pass = process.env.PASS;
    
    //our script starts now 
    await page.goto("https://qalam.nust.edu.pk/", {waitUntil: "networkidle2",});
    await page.setDefaultNavigationTimeout(0);
    await page.waitForTimeout(3500);     //delay of 3.5 seconds

    //login
    await login(id,pass,page);
    await page.waitForTimeout(13500);    //delay of 13.5 seconds

    //clicking on sidemenu
    await page.click("#sidebar_main_toggle");
    await page.waitForTimeout(100);    //delay of 0.1 seconds

    //going to feedback page
    await page.click(".scrollbar-inner > .menu_section > ul > .submenu_trigger:nth-child(7) > a");
    await page.waitForTimeout(100);    //delay of 0.1 seconds
    await page.click("ul > .act_section > ul > li > a");
    await page.waitForTimeout(10500);    //delay of 10.5 seconds


    
    
    
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


//                                         .,,..
//                                       .,;iiii;.
//                                      .,:itLCt;i:      ..
//                                       .iLGGCGGGf,.,...,,,,.
//                                        ,1LGGG00f;:......,,:,...
//                                         ,1fLGGGf,,.   ......,,,,,,.
//                                         .,,ifffL;...        .....,,,,
//                                         1;.;:.,:..             .....,,
//                                        iGfLi,  :i..           ......,,
//                                       iGGGL,    ,...     .     ......,..
// :;::,                                ,LGL1,..       .          ......,::,.
// 11ii:                                ,fCG:...                 .......,,:,,
// 1iii,             ....,,,,......     .1f1.                    ........,:,,.
// iiii,        ..,::;;;;;;;;;;;;;:::;;;:::,.                 .  .,:::::..,..,
// iiiii;;;::,::;;;;;;;;;;;;;;;i;;;;;;;;::;;;:,.                .tG000Gf:......
// 11iiiiiiiiii;;;;;;;;;;i;;;i;iii;;;;;;::::i;;:.               ;0CLffti:,....,.
// 1i;;;;;;;i;;;;;;;;;;;;;;;;iiiii;;;;;:::::::::.               ,t:::,,:,....,..
// ;i1i;;;;;;:;;;;;;;;i;i;;;;;;;;;;i;;::::,::::;.                .......  ...,..
// :i11i;ii::;;;;;;;;;;;;;;;;;;;;;;;;;;;::::::::....              ..  ..  .......
// ;i;;;;:;::;;;;;;;;;;;;ii;;;;ii;;;;ii;;;::::,,,,,,,,......           .........,.
// i;;;;;;:::;;;;;;;;iiiiiiiii;iiii;;iiiiii;::::,,:,,,............     ,;,......,,
// iii;;;;::::;;i;;;;iiii;iiiiiiiiii;;iiiii;;::::::,,,,,,,........     ,;.......,,.
// ii;;;;;;::;;;;;;;;iiiiiii;iiiiiiiiiiiiii;;;;;;:::,,:::,,,..,,..    .,,.........
// 

