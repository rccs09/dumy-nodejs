const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const ResponseProcess = require('./src/helpers/ResponseProcess');

const app = express();
app.use(express.json())
app.use(xmlparser())
const port = 3000;

let responseProcess = new ResponseProcess(`${__dirname}/src/responses/`);
app.get('*', responseProcess.getResponse);
app.post('*', responseProcess.getResponse);

app.listen(port, '0.0.0.0',  () => {
    console.log(`Iniciado el servidor en el puerto ${port}`);
});