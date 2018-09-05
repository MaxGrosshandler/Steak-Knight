const serv = require("../server.js")
const puppeteer = serv.puppeteer;
module.exports = {
  func: async (msg, args) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('http://www.google.com/search?q='+args.join(" ")+'&btnI');
  
  
    // Get the "viewport" of the page, as reported by the page.
    const url = await page.evaluate(() => {
      return document.URL;
    });
  
   msg.channel.createMessage(url)
        await browser.close();
},
  options: {
    description: "Search a thing on google!",
    fullDescription: "Returns the first google result for a search term! Might not always work for longer searches.",
    usage: "`sk g <term>`"
  },
  name: "g"
};