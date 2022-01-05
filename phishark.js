const puppeteer = require('puppeteer');
const fs = require('fs');
 
const getPhishPost = (async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    });
    const forms = await page.$$eval("form", list => {
      return list.map(l=>{
        return {
          textContent: l.textContent,
          action: l.action,
          method: l.method
        }
      });
    });
    forms.forEach(f=>{
      if(f.method == "post"){
        console.log(f.action);
      }
    });
    await page.screenshot({ path: './'+url.replace(/[¥/¥.:]/g,"-")+'.png' });
  } catch (err) {
    console.log("error");
    console.log(err);
  } finally {
    await browser.close();
  }
});

(async ()=>{
  const text = fs.readFileSync("./input.txt");
  const lines = text.toString().split(/\n/);
  for (let line of lines) {
    if(line != ""){
      await getPhishPost(line);
    }
  }
})();