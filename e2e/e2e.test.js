import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(250000);

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: false,
      slowMo: 400,
      devtools: true,
    });
    page = await browser.newPage();
    await page.setViewport({
      width: 1600,
      height: 900
    });  
    
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('корректный ввод кординат', async () => {
    const context = browser.defaultBrowserContext();
    await page.goto(baseUrl);
    await page.waitForSelector('.text_input');
    await page.type('.text_input', 'Hello!');
    await page.keyboard.press("Enter");

    await context.overridePermissions(baseUrl, ['geolocation']);
    await page.type('.login_input', '51.50851, 0.12572');
    await page.click("[type='submit']");
    await page.waitForSelector('.text_input');
  });  
  
  test('ввод координат с отсутствием пробелов', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.text_input');
    await page.type('.text_input', 'Hello!');
    await page.keyboard.press("Enter");
    
    await page.waitForSelector('.login_input');
    await page.type('.login_input', '51.50851,-0.12572');
    await page.click("[type='submit']");
    await page.waitForSelector('.login_error');
  });
  
  test('ввод координат в квадратных скобках', async () => {
    await page.evaluate( () => document.querySelector('.login_input').value = "")
    await page.type('.login_input', '[51.50851, -0.12572]');
    await page.click("[type='submit']");
    await page.waitForSelector('.login_error');
  });
});
