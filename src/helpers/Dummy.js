const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const RequestProcessor = require('./RequestProcessor');
const Constants = require('../config/general/constants');

const app = express();

class Dummy{

    constructor(){
        app.use(express.json());
        app.use(xmlparser({
            trim: false,
            explicitArray: false,
            normalizeTags: false
          }));

        let requestProcessor = new RequestProcessor(`${__dirname}/../responses/dummy/`);
        let tags = requestProcessor.getTagsUrl();

        //Set UrlParams endpoints on get request
        tags.forEach(element => {
            console.log(element.tag + " ----- " + element);
            app.get(element.tag, requestProcessor.processGetRequestUrlParams);
        });

        //set basic endpoints
        app.get('*', requestProcessor.processGetRequest);
        app.post('*', requestProcessor.processPostRequest);
        
    }

    getDummyServer(){
        return app; 
    }

}

module.exports = Dummy;