const fs = require('fs');
const Constants = require('../config/constants');

class ResponseProcess{
    basePath;
    respTypeKey;
    respTypeValue;
    respData;
    respStatus;
    respDelayTime;
    constructor(path){
        this.basePath = path;
    }

    getResponse = async (req, res) => {
        console.log("GET waaaaaaaaaaaaaaaaaa");
        const url = req.originalUrl;
        console.log("La URL es: " + url);
        this.setResponseValues(url);
        res.set(this.respTypeKey, this.respTypeValue);
        res.status(this.respStatus);
        await new Promise(resolve => setTimeout(resolve, this.respDelayTime));
        if(this.respTypeValue === Constants.APPLICATION_JSON){
            res.jsonp(this.respData)
        }else{
            res.send(this.respData);
        }
        res.end();
    }

    setResponseValues(url){
        let entrypointJson = JSON.parse(fs.readFileSync('./src/config/config.json'));
        let entrypointConfig = entrypointJson['endpoints'][url];
        if(entrypointConfig){
            this.respTypeKey = Constants.TYPE_KEY;
            if(entrypointConfig.type === Constants.TYPE_JSON){
                this.respTypeValue = Constants.APPLICATION_JSON;
                this.respData = require(this.basePath + entrypointConfig.source, "utf8");
            }else{
                this.respTypeValue = Constants.TEXT_XML;
                this.respData = fs.readFileSync(this.basePath + entrypointConfig.source, "utf8");
            }
            this.respStatus = entrypointConfig.status;
            this.respDelayTime = (entrypointConfig.delayTime || 0) * 1000;
        }else{
            this.respTypeKey = Constants.TYPE_KEY;
            this.respTypeValue = Constants.TEXT_XML;
            this.respData = fs.readFileSync(this.basePath + Constants.XML_ERROR_FILE, "utf8");
            this.respStatus = Constants.STATUS_ERROR;
            this.respDelayTime = 0;
        }
    }
}    

module.exports = ResponseProcess;