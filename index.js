const Dummy = require('./src/helpers/Dummy');
const Proxy = require('./src/helpers/Proxy');
const Constants = require('./src/config/general/constants');

const dummy = new Dummy();
const appDummy = dummy.getDummyServer();


//levanta el dummy
appDummy.listen(Constants.DUMMY_PORT, '0.0.0.0',  () => {
    console.log(`Se ha levantado el servidor de DUMMY en el puerto ${Constants.DUMMY_PORT}`);
});


//levanta el proxy
const proxy = new Proxy();
const appProxy = proxy.getProxy();
appProxy.listen(Constants.PROXY_PORT, '0.0.0.0',  () => {
    console.log(`Se ha levantado el servidor de PROXY en el puerto ${Constants.PROXY_PORT}`);
});
