const fs = require('fs');
const Constants = require('../config/general/constants');
const { Builder } = require('xml2js');

class RequestProcessor{
    basePath;
    respTypeKey;
    respTypeValue;
    respData;
    respStatus;
    respDelayTime;
    jsonConfigurations;

    constructor(path){
        this.basePath = path;
        this.jsonConfigurations = JSON.parse(fs.readFileSync('./src/config/serverDummy/dummyConfig.json'));
    }

    //process the RQs with the POST method
    processPostRequest = async (req, res) => {
        const url = req.originalUrl;
        const method = req.method;
        let reqBody;
        let reqContentType;
        let validateCT = true;
        if (req.is('application/json')) {
            console.log(req.body);
            reqBody = req.body;
            reqContentType = 'json';
        } else if (req.is('application/xml') || req.is('text/xml')) {
            // Convert the JSON object back to XML
            const builder = new Builder();
            reqBody = builder.buildObject(req.body);
            reqContentType = 'xml';
        } else {
            validateCT = false;
        }

        if(validateCT){
            console.log("Analizando POST....");
            console.log('reqBody :>> ', reqBody);
            const endpoint = this.getEndpoint(method, url, reqContentType);
            // console.log('POST -> endpoint :>> ', endpoint);
            // console.log("POST -> url: "+ url);     
            if(endpoint){
                this.setResponseValues(endpoint, reqBody, reqContentType);
            }else{// undefined endpoint
                this.getErrorResponse(reqContentType, Constants.ERROR_DUMMY_PATH);
            }
        }else{
            this.getErrorResponse(reqContentType, Constants.ERROR_CT);
        }

        //configures the response based on what is configured in the attributes
        res.set(this.respTypeKey, this.respTypeValue);
        await new Promise(resolve => setTimeout(resolve, this.respDelayTime));
        if(this.respTypeValue === Constants.APPLICATION_JSON){
            res.status(this.respStatus).jsonp(this.respData);
        }else{
            res.status(this.respStatus).send(this.respData);
        }
        res.end();
    }

    //process the RQs with the GET method that have parameters in the URL
    processGetRequestUrlParams = async (req, res) => {
        let url = req.originalUrl;
        console.log('Url :>> ', url);
        const method = req.method;
        const contentType = req.get('Content-Type') || 'No_Content-Type';
        let reqContentType;
        let validateCT = true;
        
        if (contentType ==='application/json') {
            reqContentType = 'json';
        } else if (contentType === 'application/xml' || contentType === 'text/xml') {
            reqContentType = 'xml';
        } else {
            validateCT = false;
        }

        if(validateCT){
            const param = req.params;
            Object.keys(param).forEach(function(key){
                console.log("Key: " + key + ", Value: " + param[key]);
                url = url.replace(param[key],':'+key);
            });
            console.log("Analizando GET con parametros...");
            const endpoint = this.getEndpoint(method, url, reqContentType);
            if(endpoint){
                this.setResponseValues(endpoint, '', reqContentType);
            }else{// undefined endpoint
                this.getErrorResponse(reqContentType, Constants.ERROR_DUMMY_PATH);
            }
        }else{
            this.getErrorResponse(reqContentType, Constants.ERROR_CT);
        }

        res.set(this.respTypeKey, this.respTypeValue);
        res.status(this.respStatus);
        await new Promise(resolve => setTimeout(resolve, this.respDelayTime));
        if(this.respTypeValue === Constants.APPLICATION_JSON){
            res.jsonp(this.respData);
        }else{
            res.send(this.respData);
        }
        res.end();

    }

    //process the RQs with the GET method
    processGetRequest = async (req, res) => {
        const urlOrg = req.originalUrl;
        const urlPart = urlOrg.split("?");
        const url = urlPart[0];
        console.log('Url :>> ', url);
        const method = req.method;
        const contentType = req.get('Content-Type') || 'No_Content-Type';
        let reqContentType;
        let validateCT = true;
        
        if (contentType ==='application/json') {
            reqContentType = 'json';
        } else if (contentType === 'application/xml' || contentType === 'text/xml') {
            reqContentType = 'xml';
        } else {
            validateCT = false;
        }

        if(validateCT){
            console.log("Analizando GET...");
            const endpoint = this.getEndpoint(method, url, reqContentType);
            if(endpoint){
                this.setResponseValues(endpoint, '', reqContentType);
            }else{// undefined endpoint
                this.getErrorResponse(reqContentType, Constants.ERROR_DUMMY_PATH);
            }
        }else{
            this.getErrorResponse(reqContentType, Constants.ERROR_CT);
        }

        res.set(this.respTypeKey, this.respTypeValue);
       
        await new Promise(resolve => setTimeout(resolve, this.respDelayTime));
        if(this.respTypeValue === Constants.APPLICATION_JSON){
            res.status(this.respStatus).jsonp(this.respData);
        }else{
            res.status(this.respStatus).send(this.respData);
        }
        res.end();
    }

    // search for the answers defined in dummy
    setResponseValues(endpoint, reqBody, reqContentType){
        // when it get here, it is already validated that the edpoint does exist
        let responsPath;
        let hasError = false;
        let errorType;
        //valid if the service is a single endpoint or not
        if(endpoint.onlyPath){
            //search for the dummy path based on the serviceId of the request
            responsPath = this.getDummyPathByServiceIdTag(reqBody, endpoint, reqContentType);
            //validate if it is an error RS
            if(responsPath === Constants.JSON_ERROR_SERVICE_ID_TAG_FILE || responsPath === Constants.JSON_ERROR_DUMMY_PATH_FILE ){
                errorType = responsPath === Constants.JSON_ERROR_SERVICE_ID_TAG_FILE? Constants.ERROR_SERVICE_ID_TAG :
                                            responsPath === Constants.JSON_ERROR_DUMMY_PATH_FILE? Constants.ERROR_DUMMY_PATH:
                                            Constants.ERROR_GENERAL;
                hasError = true;
            }
        }else{
            // look for the service id on the endpoint
            const responsPathJson = endpoint.source.filter(
                function(data){return (data.servicename == 'only')}
            );

            let size = responsPathJson.length;
            if(size === 1){
                responsPath = responsPathJson[0].responsePath;
            }else{
                responsPath = Constants.JSON_ERROR_DUMMY_PATH_FILE;
                errorType = Constants.JSON_ERROR_DUMMY_PATH_FILE;
                hasError = true;
            }
        }

        //configure the response fields
        if(hasError){
            this.getErrorResponse(reqContentType, errorType);
        }else{
            this.respTypeKey = Constants.TYPE_KEY;
            this.respDelayTime = (endpoint.delayTime || 0) * 1000;
            this.respStatus = endpoint.status;
            if(reqContentType === 'xml'){
                this.respTypeValue = Constants.TEXT_XML;
                this.respData = fs.readFileSync(this.basePath + responsPath, "utf8");
            }else if(reqContentType === 'json'){
                this.respTypeValue = Constants.APPLICATION_JSON;
                this.respData = require(this.basePath + responsPath, "utf8");
            }
        }
        
    }

    //returns the dummy error response settings, based on Content-type and error type
    getErrorResponse(reqContentType, errorType){
        this.respTypeKey = Constants.TYPE_KEY;
        this.respStatus = Constants.STATUS_ERROR;
        this.respDelayTime = 0;
        if(reqContentType === 'xml'){
            this.respTypeValue = Constants.TEXT_XML;
            switch (errorType) {
                case Constants.ERROR_CT:
                    this.respData = fs.readFileSync(this.basePath + Constants.XML_ERROR_CT_FILE, "utf8");
                    break;
                case Constants.ERROR_DUMMY_PATH:
                    this.respData = fs.readFileSync(this.basePath + Constants.XML_ERROR_DUMMY_PATH_FILE, "utf8");
                    break;
                case Constants.ERROR_SERVICE_ID_TAG:
                    this.respData = fs.readFileSync(this.basePath + Constants.XML_ERROR_SERVICE_ID_TAG_FILE, "utf8");
                    break;
                default:
                    this.respData = fs.readFileSync(this.basePath + Constants.XML_ERROR_FILE, "utf8");
                    break;
            }
        }else{ //if it is JSON
            this.respTypeValue = Constants.APPLICATION_JSON;
            switch (errorType) {
                case Constants.ERROR_CT:
                    this.respData = require(this.basePath + Constants.JSON_ERROR_CT_FILE, "utf8");
                    break;
                case Constants.ERROR_DUMMY_PATH:
                    this.respData = require(this.basePath + Constants.JSON_ERROR_DUMMY_PATH_FILE, "utf8");
                    break;
                case Constants.ERROR_SERVICE_ID_TAG:
                    this.respData = require(this.basePath + Constants.JSON_ERROR_SERVICE_ID_TAG_FILE, "utf8");
                    break;
                default:
                    this.respData = require(this.basePath + Constants.JSON_ERROR_FILE, "utf8");
                    break;
            }
        }
    }

    //Returns the path of the dummy response based on the serviceId obtained from the request, the endpoint and the Content-type
    getDummyPathByServiceIdTag(reqBody, endpoint, reqContentType){
        const serviceNameTag = endpoint.serviceNameTag;
        let responsePathDummy;
        let serviceId;
        if(reqContentType === 'xml'){
           // Look in the request for the serviceNameTag defined in the dummyConfig.json for the service you are analyzing
            if(reqBody.includes(`<${serviceNameTag}>`)){
                serviceId = reqBody.substring(reqBody.indexOf(`<${serviceNameTag}>`), reqBody.indexOf(`</${serviceNameTag}>`)).split(">")[1];
            }
        }else if(reqContentType === 'json'){
            //Look in the request for the serviceNameTag defined in the dummyConfig.json for the service you are analyzing
            let serviceIdArray = this.findTagOnJson(reqBody, serviceNameTag);
            let size = serviceIdArray.length;
            if(size === 1){
                serviceId = serviceIdArray[0];
            }
        }

        if(serviceId){
            // look for the service id on the endpoint
            const responsPathJson = endpoint.source.filter(
                function(data){return (data.servicename == serviceId)}
            );

            let size = responsPathJson.length;
            if(size === 1){
                responsePathDummy = responsPathJson[0].responsePath;
            }else{
                // Load the error msg indicating that the dummy definition was not found (path of the response)
                responsePathDummy = Constants.JSON_ERROR_DUMMY_PATH_FILE;
            }
        }else{
              // Load the error msg indicating that the serviceId tag was not found in the request
              responsePathDummy = Constants.JSON_ERROR_SERVICE_ID_TAG_FILE;
        }
        return responsePathDummy;
    }


    //Search for a specific tag within a json, return an array of the values ​​of all the tags found
    findTagOnJson(obj, tag) {
        let result = [];
      
        function search(obj) {
          if (!obj || typeof obj !== 'object') {
            return;
          }
      
          if (obj.hasOwnProperty(tag)) {
            result.push(obj[tag]);
          }
      
          for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
              search(obj[key]);
            }
          }
        }
      
        search(obj);
        return result;
      }


    //Returns a list of all endpoints defined in dummyConfig.json and that have the 'tag' attribute configured
    getTagsUrl(){
        let endPoints = JSON.parse(JSON.stringify(this.jsonConfigurations['endpoints']));
        
        return endPoints.filter(
            function(data){ return data.tag }
        );
    }
    
    // search for the endpoint defined in the dummyConfig.json file
    getEndpoint(method, url, reqContentType){
        //identify the server in the server.json file
        let endpoints = JSON.parse(JSON.stringify(this.jsonConfigurations['endpoints']));

        let endpoint;
        if(method === "POST"){
            // if it is post I search by url, method and content-type
            endpoint = endpoints.filter(
                function(data){return (data.url == url && data.method == method && data.type == reqContentType)}
            );
            console.log(endpoint);
        }else if(method === "GET"){
            //if it is get without parameters, I search only by URL and content-type
            endpoint = endpoints.filter(
                function(data){return (data.url == url && data.type == reqContentType)}
            );
            console.log(endpoint);
        }else{
            console.log("Metodo no implementado");
        }

        let size = endpoint?endpoint.length:0;
        if(size === 1){
            return endpoint[0];
        }else{
            return ;
        }
    }

    

}    

module.exports = RequestProcessor;