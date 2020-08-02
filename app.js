const {Builder, By, Key, until} = require('selenium-webdriver');

const csv = require('csv-parser');
const fs = require('fs');

(async function example() {
    let driver
    try {
        let ruts = []
        fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (objectRut) => {
              const key = Object.keys(objectRut)
              const rut = objectRut[key].split(";")[1]
              const name = objectRut[key].split(";")[0]
              ruts = [...ruts,rut]
        })
        .on('end', () => {
           console.log('CSV file successfully processed');
        });  
        await new Promise(resolve => setTimeout(resolve, 3000))
       // ruts.map(rut => rut.replace(";",""))
        driver = await new Builder().forBrowser('chrome').build();
        // Enter text "cheese" and perform keyboard action "Enter"
        for(let rut of ruts)
        {
            try{         
                for(let i = 0;i<3;i++){
               // await driver.get('https://bancapersonas.bancoestado.cl/eBankingBech/login/caja_login.htm');
                driver.navigate().to('https://bancapersonas.bancoestado.cl/eBankingBech/login/caja_login.htm');
                await new Promise(resolve => setTimeout(resolve, 3000))
                await driver.findElement(By.id('username')).sendKeys(rut);
                await driver.findElement(By.id('password')).sendKeys('1234');
                await driver.findElement(By.id('enviar')).click();
                await new Promise(resolve => setTimeout(resolve, 3000))
                }
            }
            catch(err)
            {
                console.log(err)
            } 
        }        
    }
    catch(err)
    {
        console.log(err)
    }
    finally{
        await driver.quit()
    }
})();