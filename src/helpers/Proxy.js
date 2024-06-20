const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const request = require('request');
const fs = require('fs');
const Constants = require('../config/general/constants');
const { Router, Response, Request } = require('express');

const app = express();

class Proxy{
    jsonDummies;
    jsonServers;

    constructor(){
        this.jsonDummies = JSON.parse(fs.readFileSync('./src/config/serverProxy/proxyDummiesConfig.json'));
        this.jsonServers = JSON.parse(fs.readFileSync('./src/config/serverProxy/proxyServersConfig.json'));
        //app.use(bodyParser.text({ type: 'text/xml' }));
        app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }));

        app.use((req, res, next) => {
            const xml = req.body;
            const originalPath = req.originalUrl;
            console.log('originalPath :>> ', originalPath);
            console.log('xml :>> ', xml);
            //verifica que el xml no este vacio
            if(!xml || xml.trim() === ''){
                return res.status(400).send('El xml debe comenzar con un tag');
            }

            // Parsear el xml
            xml2js.parseString(xml, {trim: false}, (err, result) => {
                if(err){
                    console.error('Error al parsear el XML: ', err);
                    return res.status(400).send('Error al parsear XML');
                }

                console.log('Resultado del parsing: ', result);

                // Busca la definicion del servidor al que originalmente quiere ir
                // esto esta definido en servers.json
                const server = this.getServer(originalPath);
                const serviceId = this.getServiceIdTag(xml, server);

                console.log('serviceId :>> ', serviceId);

                if(!serviceId){
                    return res.status(400).send('Tag serviceId no encontrado en el XML');
                }

                // Determinar la URL de destino basada en el valor del serviceId
                const targetHost = this.getTarget(serviceId, server);
                console.log('targetHost :>> ', targetHost);

                //Construir la URL completa de destino con la misma ruta
                const targetUrl = `${targetHost}${req.path}`;

                console.log('Redirigiendo a: ', targetUrl);

                //Realiza el request a la URL de destino
                const options = {
                    url: targetUrl,
                    method: req.method,
                    headers: req.headers,
                    body: xml
                };

                request(options, (error, reposponse, body) => {
                    if(error){
                        console.error('Error al redirigir el request: ', error);
                        return res.status(500).send('Error al redirigir el request');
                    }

                    //Pasar el response del servidor de destino al cliente
                    res.status(express.response.statusCode).send(body);
                });

            });
        });
    }

    getServer(originalPath){
        //identifico el server en el archivo server.json
        let servers = JSON.parse(JSON.stringify(this.jsonServers['servers']));

        let server = servers.filter(
            function(data){return data.path == originalPath}
        );

        if(server.length === 0){
            console.log(`No se encontro la definicion del servicio ${originalPath}`);
            server = servers.filter(
                function(data){return data.server == Constants.DUMMY_SERVER_NAME}
            );

            if(server.length === 0){
                console.log(`No se encontro la definicion del servicio ${Constants.DUMMY_SERVER_NAME}`);
            }
        }

        return server;
    }

    getTarget(serviceId, server){
        //identifico si el servicio debe ir a dummy
        let dummies = JSON.parse(JSON.stringify(this.jsonDummies['serverDummies']));

        let dummyServices = dummies.filter(
            function(data){return data.path == server[0].path}
        );

        console.log('dummyServices :>> ', dummyServices[0].serviceId);

        // Busca si el servicio esta definido en el dummy
        const foundService = dummyServices[0].serviceId.find((element) => element == serviceId);
        //Lo encontro en la definicion de servicios que van a dummy
        if(foundService){
            console.log("Si lo encontro");
            const serverDummy = this.getServer("/");
            return serverDummy[0].URL;
        }else{
            return server[0].URL
        }
    }

    getServiceIdTag(xml, server){
        //Verificamos si el servidor es dummy
        let serviceId = Constants.DUMMY_SERVER_NAME;
        if(server[0].server === Constants.DUMMY_SERVER_NAME){
            serviceId = Constants.DUMMY_SERVER_NAME;
        }else{
            const serviceIdTag = server[0].serviceIdTag;
            const servideIdCode = server[0].serviceId;
            //serviceId = eval(serviceIdCode);
            if(xml.includes(`<${serviceIdTag}>`)){
                serviceId = xml.substring(xml.indexOf(`<${serviceIdTag}>`), xml.indexOf(`</${serviceIdTag}>`)).split(">")[1];
            }
        }

        return serviceId;
    }

    getProxy(){
        return app;
    }

}

module.exports = Proxy;