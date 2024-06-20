const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }));

app.post('/TEST_SERVER', (req, res) => {
    const xml = req.body;
    let serviceId='';
    let data;
    console.log('Request Body :>> ', xml);
    if(xml.includes("<serviceName>")){
        serviceId = xml.substring(xml.indexOf("<serviceName>"), xml.indexOf("</serviceName>")).split(">")[1];
        console.log('serviceId :>> ', serviceId);
        if(serviceId==='testServerService1'){
            data = fs.readFileSync('./src/testResources/responses/rsServerTestService1.xml', "utf8");
        }else  if(serviceId==='testServerService2'){
            data = fs.readFileSync('./src/testResources/responses/rsServerTestService2.xml', "utf8");
        }else  if(serviceId==='testServerService3'){
            data = fs.readFileSync('./src/testResources/responses/rsServerTestService3.xml', "utf8");
        }else{
            console.log("Servicio no encontrado");
            data = fs.readFileSync('./src/testResources/responses/error.xml', "utf8");
        }
    }else{
        console.log("Request no contiene el nombre del servicio");
        data = fs.readFileSync('./src/testResources/responses/error.xml', "utf8");
    }
    res.send(data);
});

app.listen(3011, () => {
    console.log('Server 1 listening on port 3011');
});
