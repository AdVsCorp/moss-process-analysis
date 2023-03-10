const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

// Read the file Logfile.log
fs.readFile('Logfile.log', 'utf8', async function(err, data) {
  if (err) throw err;

  const regex = /\t(\S*\.exe)/g;
  const matches = data.match(regex);

  // Check if the output file already exists, if so, delete it to avoid errors
  const outputDir = path.join(__dirname, 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  } else {
    fs.readdirSync(outputDir).forEach((file) => {
      fs.unlinkSync(path.join(outputDir, file));
    });
  }

  // Save exe file names without tabs
  const result = matches.map((value) => value.trim());

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
  ];

  for (const element of result) {
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const browser = await puppeteer.launch({
      headless: true,
      args: [`--user-agent=${randomUserAgent}`]
    });

    const page = await browser.newPage();

    await page.goto('https://www.qwant.com/?q=' + element);

    // Check if the output file already exists, if so, delete it to avoid errors
    const outputFilePath = path.join(outputDir, `${element}.png`);
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    await page.screenshot({
      path: outputFilePath,
      fullPage: true
    });

    await browser.close();
  }
});
