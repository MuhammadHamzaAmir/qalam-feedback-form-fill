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

    /***when headless = true (Comment out the following code)**/
    // await page.setViewport({
    //     width: 1920,
    //     height: 1080,
    //     deviceScaleFactor: 1,
    //   });
    
    //our credentials
    var id = process.env.ID;
    var pass = process.env.PASS;
    var high_rate = process.env.HIGH_RATE;
    var low_rate = process.env.LOW_RATE;
    var comment = process.env.COMMENTS;

    //total number of courses
    var courses = 0;
    
    //our script starts now 
    await page.goto("https://qalam.nust.edu.pk/", {waitUntil: "networkidle2"});
    await page.setDefaultNavigationTimeout(0);
    await page.waitForTimeout(3500);     //waitForTimeout of 3.5 seconds

    //login
    await userLogin(id,pass,page);
    await page.waitForTimeout(30000);    //waitForTimeout of 30 seconds

    //clicking on sidemenu
    await page.click("#sidebar_main_toggle");
    await page.waitForTimeout(1000);    //waitForTimeout of 1 seconds

    //going to feedback page
    await page.waitForSelector(".scrollbar-inner > .menu_section > ul > .submenu_trigger:nth-child(7) > a");
    await page.click(".scrollbar-inner > .menu_section > ul > .submenu_trigger:nth-child(7) > a");
    await page.waitForTimeout(100);    //waitForTimeout of 0.1 seconds
    await page.click("ul > .act_section > ul > li > a");
    await page.waitForTimeout(15500);    //waitForTimeout of 15.5 seconds

    // clicking student feedback form
    var total_forms = await page.$$("div > .uk-row-first > .uk-tab > .uk-active");

    for(let i=0;i<total_forms.length;i++){
        await page.waitForTimeout(29);
        var selector = "#page_content_inner > div > div > div > div > div > ul.uk-tab > li:nth-child("+(i+1)+") > a"
        let elem = await page.waitForSelector(selector);
        let form_name = await elem.evaluate((el)=>el.textContent);

        if (form_name.includes("Student")){
            await page.click(selector);
            await page.waitForTimeout(50);
            break;
        }
    }

    await page.waitForTimeout(3000);    //waitForTimeout of 3 seconds
    
    await getCourses(context,page, courses, low_rate,high_rate, comment);

    await page.bringToFront();
    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(5000);

    
    await browser.close();
})();

//login function
async function userLogin(id, pass, page) {
/**
 * The login function is used to log into the website.
 * It takes in 3 parameters, id, pass and page.
 * The function first enters the username into the login field using type method of puppeteer. 
 * Then it waits for 420 milliseconds before entering password using type method of puppeteer. 
 * After that it clicks on login button using click method of puppeter and waits for 100 milliseconds before returning control back to main function which calls next functions in sequence after this function returns control back to main().
 *
 * @param id - Used to enter the id of the user.
 * @param pass - Used to enter the password.
 * @param page - Used to interact with the page.
 * @return - a promise object.
 * @doc-author - Trelent
 */

    await page.type("#login", id, { waitForTimeout: 69 }); //entering id
    await page.waitForTimeout(420); //waitForTimeout of 0.42 secs
    await page.type("#password", pass, { waitForTimeout: 69 }); //entering password
    await page.waitForTimeout(100); //waitForTimeout of 0.1 secs
    await page.click("button[type='submit']"); //clicking the login button

}




async function getCourses(browser,page,courses,low_rate,high_rate,comment) {
/**
 * The getCourses function is used to get the courses from the page.
 *
 * 
 * @param browser - Used to open the browser
 * @param page - Used to navigate to the form page.
 * @param courses - Used to store the courses that are found on the page.
 * @param low_rate - Used to set the minimum rating of a course.
 * @param high_rate - Used to set the maximum rate of a course.
 * @param comment - Used to specify the comment to be filled in the form.
 * @return - an array of all the courses.
 * 
 * @doc-author - Trelent
 */

    courses = await page.$$("#hierarchical-show > div");        //getting total number of courses
    await page.waitForTimeout(1000);

    // iterating over all the course and filling them
    for(let i =0 ; i<(courses.length-1);i++){
        await page.waitForTimeout(150);

        //going to form page
        var selector = "#hierarchical-show > div:nth-child("+(i+1)+") > ul > li:nth-child(1) > a"

        let elem = await page.waitForSelector(selector);
        await elem.evaluate((el) =>
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          })
        );


        await page.waitForTimeout(2000);

        let form_page = await page.click(selector);

        await page.waitForTimeout(5000);
        var pages_list = await browser.pages();
        //console.log(pages_list.length);
        form_page = pages_list[pages_list.length-1]
        await form_page.waitForTimeout(10000);

        await fillForm(form_page,rate,comment);
        
        await form_page.waitForTimeout(2000);
        await form_page.close();

        await page.bringToFront();
        await page.waitForTimeout(100);


    }

}


//form filling function
async function fillForm(page,rate,comment) {
  /**
   * The fill_form function fills the form with the given rate and comment.
   *
   *
   * @param page - Used to specify the page to be opened.
   * @param rate - Used to select the rating for a course.
   * @param comment - Used to fill the comment box.
   * @return - the page object.
   *
   * @doc-author - Trelent
   */
  
  if (rate > 5 || rate < 1) {
    rate = 3;
  }
  var rate_int = parseInt(rate); 
  // iterating over all the course and filling them
  for (let i = 0; i < 15; i++) {
    var selector =
      ".table > tbody > tr:nth-child(" +
      (i + 1) +
      ") > td:nth-child(" +
      (rate_int + 1) +
      ") > input";
    let elem = await page.waitForSelector(selector);
    await elem.evaluate((el) =>
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    );
    await page.waitForTimeout(1500);
    await page.click(selector);
  }

  // entering input
    var selector = "textarea";
    let elem = await page.waitForSelector(selector);
    await elem.evaluate((el) =>
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    );
    await page.waitForTimeout(3000);
    await page.focus(selector);
    await page.keyboard.type(comment);

  //submitting the form
    await page.waitForTimeout(2500);
    selector = ".wrap > .container > .js_surveyform > .text-center > .btn";
    elem = await page.waitForSelector(selector);
    await elem.evaluate((el) =>
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    );
    await page.waitForTimeout(3000);
    await page.click(selector);

    await page.waitForTimeout(5000);
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

//                 .
//                .;;:,.
//                 ;iiii;:,.                                   .,:;.
//                 :i;iiiiii:,                            .,:;;iiii.
//                  ;iiiiiiiii;:.                    .,:;;iiiiii;i:
//                   :iiiiiiiiiii:......,,,,,.....,:;iiiiiiiiiiii;
//                    ,iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:
//                     .:iii;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;,
//                       .:;;iiiiiiiiiiiiiiiiiiiiiiiiiii;;ii;,
//                        :iiii;;iiiiiiiiiiiiiii;;iiiiiii;:.
//                       ,iiii;1f:;iiiiiiiiiiii;if;:iiiiiii.
//                      .iiiii:iL..iiiiiiiiiiii;:f: iiiiiiii.
//                      ;iiiiii:.,;iiii;iiiiiiii:..:iiiiiiii:
//                     .i;;;iiiiiiiiii;,,;iiiiiiiiiiii;;iiiii.
//                     ::,,,,:iiiiiiiiiiiiiiiiiiiiii:,,,,:;ii:
//                     ;,,,,,:iiiiiiii;;;;;;;iiiiii;,,,,,,;iii.
//                     ;i;;;;iiiiiiii;:;;;;;:iiiiiii;::::;iiii:
//                     ,iiiiiiiiiiiiii;;;;;;:iiiiiiiiiiiiiiiiii.
//                      .iiiiiiiiiiiiii;;;;;iiiiiiiiiiiiiiiiiii:
//                       .;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;
//                        ;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.
//                       .;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,

