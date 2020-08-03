const {Builder, By, Key, until} = require('selenium-webdriver');

const csv = require('csv-parser');
const fs = require('fs');
const { config } = require('process');

const {diccionario} = require('./config/diccionario');

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
        //driver.manage().window().setSize(new Dimension(100,100)); 
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

                let index = await driver.getPageSource();
               
                let atenderlo = await (index.indexOf( diccionario.NoPodemosAtenderlo.value ))
                if( atenderlo != -1){
                    console.log("no se peude atender en este momento")
                }


                let clave = await (index.indexOf( diccionario.ClaveValida.value ))
                if( clave != -1 ){
                    //hacer algo aca
                    console.log("otro caso")
                }
                

                await new Promise(resolve => setTimeout(resolve, 30000))
                }
            }
            catch(err)
            {
                //CONTROLAR ERROR DE RUT VALIDO
                console.log( err.stack.indexOf(  diccionario.ErrorRut.value ) )
                if( err.stack.indexOf(  diccionario.ErrorRut.value ) != -1 ){
                    //ACA CAPTURASTE QUE ES UN ERROR DE RUT
                }
                //console.log(err)
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