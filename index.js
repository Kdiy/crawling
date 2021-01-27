const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const chromePaths = require('chrome-paths');
const express = require('express')

const app = express()
const template_path = __dirname + '/html/view/'


app.get('/',async (req,res)=>{
    res.sendFile(template_path + 'index.html')
})
app.post('/',async (req,res)=>{
    console.log(req.data)
    res.send('123')
})
app.get('/fetch',async (req,res)=>{
    const {uri} = req.query
    const options = {
        // devtools: true,
        headless: false,
        args: ['--disable-infobars'],
        executablePath: chromePaths.chrome,
        // userDataDir: __dirname + 'AppData/'
    }
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(uri, { waitUntil: 'domcontentloaded'});
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false })
    })
    const result = await page.evaluate((e) => {
        const arrList = []

        // aliexpress
        // let itemList = document.querySelectorAll('.product-list>.list-items>div')
        // itemList.forEach(element=>{
        //     const goods_group = element.querySelectorAll(".list-item")
        //     goods_group.forEach(item=>{
        //         const data = {
        //             title: element.querySelector(".product-info .item-title").innerText,
        //             img: element.querySelector(".product-img img").src,
        //             price: element.querySelector(".product-info>.hover-help>.item-price-wrap>.item-big-promotion>.price-current").innerText
        //         }
        //         arrList.push(data)
        //     })
        // })
        // 1688
        document.querySelectorAll("video").forEach((item)=>
            arrList.push(item.src)
        );
        document.querySelectorAll(".tab-content-container>.nav>li").forEach(function(item){
            var src = JSON.parse(item.getAttribute('data-imgs'));
            arrList.push(src.original)
        });

        return arrList;
    })

    // res.json(result)

    // await page.screenshot({path: 'example.png'});


    // const dimensions = await page.evaluate(() => {
    //     return {
    //         width: document.documentElement.clientWidth,
    //         height: document.documentElement.clientHeight,
    //         deviceScaleFactor: window.devicePixelRatio
    //     };
    // });
    page.on('load',  () => {
        setTimeout(()=>{
            browser.close();
        },1500)
        res.json(result)

    });
    // console.log('Dimensions:', dimensions);


    // await browser.close();
    // res.json({name: '123'})
})

app.listen(8080,()=>{
    console.log('server start 8080')
})

