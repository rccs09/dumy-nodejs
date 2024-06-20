
# Documentation
1. [Spanish Documentation](#spanish-documentation)
2. [English documentation](#english-documentation)

</br></br></br>


# Spanish Documentation
</br>

# Descripción
Este proyecto esta desarrollado en JavaScript usando NodeJS.
Su principal función es levanta un Proxy y un Dummy, que se describen a continuación.
- **Proxy**: permite receptar los request, analizarlos y redireccionar la peticion al servidor original o al Dummy dependiendo del servicio que se indique dentro del request.
- **Dummy**: permite definir una respuesta de un servicio especifico, acepta metodos GET y POST, el dumy filtra por URL, metodo y servicio a consumir, de acuerdo a lo que tenga configurado.

# Instalación
- **Prerequicitos**: Este proyecto fue desarrollado con las siguientes versiones:
  - node: 21.5.0
  - npm: 10.2.4
  - Se recomienda tener estas versiones o versiones superiores para su uso.
  
- **Instalación**:
  - La instalación se realiza una sola vez o para regenerar la carpeta de importacion de modulos 'node_modules'.
  - Para esto ingresamos por terminal al path donde está el proyecto y ejecutar:
    ```unix
    npm install
    ```
# Inicio rápido
## Dummy
- Se debe configurar el dummy en el archivo 'src/config/serverDummy/dummyConfig.json', para mas detalles de como hacerlo ir al apartado [Configuracion Dummy](#configuracion-dummy)

- Ingresamos por terminal al path donde está el proyecto y ejecutar:
    ```unix
    node index.js
    ```
- NOTA: Esto levantará el Dummy y el Proxy.
  - El Dummy se levanta en el puerto 3001: http://localhost:3001

## Proxy
- El Proxy tiene dos archivos de configuracion:
  - 'proxyServersConfig.json': donde se configuran los servidores a los que se va a redirigir.
  - 'proxyDummiesConfig.json': donde se configuran los servicios que van a dummy.
  - Para mas detalles de como hacerlo ir al apartado [Configuracion Proxy](#configuracion-proxy)

- NOTA: Esto levantará el Dummy y el Proxy.
  - El Proxy se levanta en el puerto 3021: http://localhost:3021
  - Para mas detalles de la configuración ir al apartado [Configuracion Proxy](#configuracion-proxy)

# Configuracion Dummy
- Incialmente y para entender de una mejor manera el documento definiremos las partes de una URL
- ## Partes de una URL 
  - Tomaremos como ejemplo la siguiente URL:
    http://example.com:80/mainPath/service?name=Peter
    Donde:
    - http://: Protocolo, es el protocolo a usar
    - example.com: Dominio, es el dominio principal de mi URL
    - 80: Puerto, es el puerto del servicio
    - mainPath/service: Path, es la ruta dentro del servidor
    - ?name=Peter: Parametros, son los parametros que se envian en la URL

- El dummy valida los endpoints definidos y en base a eso genera una respuesta respectiva.
- Por lo tanto para configurar el dummy es necesario configurar un endpoint.
- ## Definicion de un endpoint
  - Para definir un endpoint es necesario tener claro los siguientes campos del endpoint:
    - **method**: Metodo de la solicitud, puede ser 'GET' o 'POST'.
    - **url**: URL de la solicitud, sin incluir el protocolo y el dominio.
    - **type**: Content-type resumido de la solicitud, este puede ser 'json' o 'xml'
      - Los Content-type que acepta el dummy como parte del header del request son:
        - **application/json** para JSON y en el campo 'type' se definirá como 'json'.
        - **application/xml** o **text/xml** para XML y en el campo 'type' se definirá como 'xml'.
    - **source**: Es un arreglo de los servicios y paths de las respuestas que entregara el dummy, los datos del arreglo tienen estos campos:
      - **servicename**: Este depende de lo siguiente:
        - Si el servicio a consumir esta definido en la URL se usará el valor 'only'
        - Si el servicio a consumir esta dentro del body del request el valor debe ser el nombre del servicio.
      - **responsePath**: 
        - Indica el path donde se encuentra el archivo de respuesta que entregará el dummy para el servicio respectivo, esto se encuentra dentro de la carpeta 'src/responses'
        - Se recomienda crear una carpeta para cada proyecto.
    - **serviceNameTag**: Este depende de lo siguiente:
      - Si el servicio a consumir esta definido en la URL, no se usará ningún valor ''
      - Si el servicio a consumir esta dentro del body del request el valor debe ser el nombre del tag del xml o el atributo de json en el que se encuentra el nombre del servicio a consumir.
    - **tag**:Este atributo se usa para generar un dummy para los servicios get en los cuales vienen los parametros como parte de la URL, por ejemplo para la URL "http://localhost:3001/mydomain/json/user/Jhon/address/Miami" pasa como parametro los datos 'user' y 'address', entonces: 
      - Si el servicio es un servicio get que envia los parametros como parte de la URL, este campo debe tener lo siguiente:
        - /mydomain/json/user/:user/address/:dir
      - Si el servicio **NO** es un servicio get que envia los parametros como parte de la URL, este campo debe ser vacio ''
    - **status**: Es el codigo http con el que el dummy genera el response.
    - **delayTime**": Si es necesario que el response tarde en responder, este campo debe conntener la cantidad de segundos de espera antes de enviar el response.
    - **onlyPath**: Este campo va de la mano con el sub-campo 'servicename' del campo 'source' y con el campo 'serviceNameTag'
      - En el caso de que el servicio a consumir esta definido en la URL se usará el valor **true**
      - De lo contrario debe ser **false**

- ## Casos de uso:
- Este proyecto genera respuestas Dummy para los siguientes casos:
  - Servicios GET sin parametros.
  - Servicios GET con parametros.
  - Servicios GET con parametros dentro de la URL.
  - Servicios POST con URL variable.
  - Servicios POST con una unica URL.

- A continuacion se decriben ejemplos de los casos de uso y como configurarlos en el Dummy:

  - ### Servicios GET sin parametro
    - Estos servicios tienen una URL fija y no envian parametros, por ejemplo la siguiente URL:
      http://myDomain:8080/mypath/getWithoutParams
    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **JSON**
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"json",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.json"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **XML**  
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"xml",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.xml"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```
      - Puntos a tener en cuenta en esta configuracion:
        - En el campo **url** se debe poner la URL del servicio original sin el protocolo, dominio y puerto, [ver partes de una URL](#partes-de-una-url)
        - En vista de que la URL consume un servicio especifico, el campo **servicename** se debe configurar como **only**
        - El campo **responsePath** indica la ruta dentro del paht **src/responses** en este proyecto, que contiene la respuesta ya sea JSON o XML que entregará el Dummy para este servicio .
        - Para este caso de uso los campos **serviceNameTag** y **tag** no se usan, por lo que se dejaran vacios.
        - El campo **onlyPath** no se usa para esta caso de uso por lo que debemos dejarlo en **false**
      - Para mas detalles de cada campo [Ver Definicion de un endpoint](#definicion-de-un-endpoint)
      - Una vez completado los cambios guardamos y reiniciamos el Dummy.
      - Para consumir el servicio que configuramos en Dummy, teniendo en cuenta que este se levanta en el puerto **3001** debemos consumir la URL:
          http://localhost:3001/mypath/getWithoutParams

  - ### Servicios GET con parametros
    - Estos servicios tienen una URL con un Path fijo pero adicionalmente envian parametros depues del caracter **?**, por ejemplo la siguiente URL:
        http://myDomain:8080/mypath/getWithParams?param1=value1&param2=value2

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **JSON**
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **XML**  
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
      - Puntos a tener en cuenta en esta configuracion:
        - En el campo **url** se debe poner la URL del servicio original sin el protocolo, dominio, puerto y eliminamos los parametros,[ver partes de una URL](#partes-de-una-url)
        - En vista de que la URL consume un servicio especifico, el campo **servicename** se debe configurar como **only**
        - El campo **responsePath** indica la ruta dentro del paht **src/responses** en este proyecto, que contiene la respuesta ya sea JSON o XML que entregará el Dummy para este servicio.
        - Para este caso de uso los campos **serviceNameTag** y **tag** no se usan, por lo que se dejaran vacios.
        - El campo **onlyPath** no se usa para esta caso de uso por lo que debemos dejarlo en **false**
      - Para mas detalles de cada campo [Ver Definicion de un endpoint](#definicion-de-un-endpoint)
      - Una vez completado los cambios guardamos y reiniciamos el Dummy.
      - Para consumir el servicio que configuramos en Dummy, teniendo en cuenta que este se levanta en el puerto **3001** debemos consumir la URL:
          http://localhost:3001/mypath/getWithParams?param1=value1&param2=value2


  - ### Servicios GET con parametros dentro de la URL
    - Estos servicios tienen una URL con un Path fijo pero adicionalmente y como parte del path envian parametros entre el caracter **/**, por ejemplo la siguiente URL:
      http://myDomain:8080/mypath/user/Jhon/address/Miami
    
    - Pasa como parametros **user** con el valor **Jhon** y **address** con el valor **Miami**

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **JSON**
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **XML**  
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
      - Puntos a tener en cuenta en esta configuracion:
        - En el campo **url** se debe poner la URL del servicio original sin el protocolo, dominio, puerto ,[ver partes de una URL](#partes-de-una-url) y los parametros deben asignarse a variables indicandolas con el caracter **:** y el nombre arbitrario de las variables.
          - Para la URL de ejemplo: http://myDomain:8080/mypath/user/Jhon/address/Miami
          - Usamos el path: /mypath/
          - Concatenando con el path de parametro y la definicion de la variable para este parametro:
            - Para la variable **user** definimos la variable **:user**
            - Para la variable **address** definimos la variable **:dir**
        - En vista de que la URL consume un servicio especifico, el campo **servicename** se debe configurar como **only**
        - El campo **responsePath** indica la ruta dentro del paht **src/responses** en este proyecto, que contiene la respuesta ya sea JSON o XML que entregará el Dummy para este servicio.
        - Para este caso de uso los campos **serviceNameTag** no se usa, por lo que se dejaran vacios.
        - Para este caso si usamos el campo **tag** y debemo poner el mismo valor que pusimos en el campo **url**
        - El campo **onlyPath** no se usa para esta caso de uso por lo que debemos dejarlo en **false**
      - Para mas detalles de cada campo [Ver Definicion de un endpoint](#definicion-de-un-endpoint)
      - Una vez completado los cambios guardamos y reiniciamos el Dummy.
      - Para consumir el servicio que configuramos en Dummy, teniendo en cuenta que este se levanta en el puerto **3001** debemos consumir la URL:
          http://localhost:3001/mypath/user/Jhon/address/Miami


  - ### Servicios POST con URL variable
    - En estos servicios cada URL consume un servicio específico:
      http://myDomain:8080/mypath/post/specific/service

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **JSON**
      ```json
        {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **XML**  
      ```json
          {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
      - Puntos a tener en cuenta en esta configuracion:
        - En el campo **url** se debe poner la URL del servicio original sin el protocolo, dominio y puerto, [ver partes de una URL](#partes-de-una-url)
        - En vista de que la URL consume un servicio especifico, el campo **servicename** se debe configurar como **only**
        - El campo **responsePath** indica la ruta dentro del paht **src/responses** en este proyecto, que contiene la respuesta ya sea JSON o XML que entregará el Dummy para este servicio.
        - Para este caso de uso los campos **serviceNameTag** y **tag** no se usan, por lo que se dejaran vacios.
        - El campo **onlyPath** no se usa para esta caso de uso por lo que debemos dejarlo en **false**
      - Para mas detalles de cada campo [Ver Definicion de un endpoint](#definicion-de-un-endpoint)
      - Una vez completado los cambios guardamos y reiniciamos el Dummy.
      - Para consumir el servicio que configuramos en Dummy, teniendo en cuenta que este se levanta en el puerto **3001** debemos consumir la URL:
          http://localhost:3001/mypath/post/specific/service

  - ### Servicios POST con una unica URL
    - Estos servicios exponen una unica URL y el servicio que se va a consumir viene en el body del requets ya sea en un tag del XML o en un atributo JSON de ser el caso. por ejemplo tenemos la URL:
      http://myDomain:8080/mypath/service
      
    - Este puede exponer varios servicios pero nosotros queremos generar un Dummy unicamente para los servicios:
      - testService1
      - testService2

    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **JSON**
      ```json
        {
            "method":"POST",
            "url":"/mypath/service",
            "type":"json",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.json"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.json"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
        }
      ```
      - Tomaremos como referencia el request json, donde el nombre del servicio viene como parte del request en el atributo **serviceName**
        ```json
            {
                "request": {
                    "header": {
                        "sesionId": "mySessionId",
                        "serviceName": "testService1"
                    },
                    "body": {
                            "dataInfo": "data info example",
                            "otherData":"other data example"
                    }
                }
            }
        ```
    - La siguiente sería la configuracion del dummy de este servicio en el caso de ser un **XML**  
      ```json
          {
            "method":"POST",
            "url":"/mypath/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.xml"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.xml"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
        }
      ```

      - Tomaremos como referencia el request XML, donde el nombre del servicio viene como parte del request en el tag **serviceName**
        ```xml
            <soapenv:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
                <soapenv:Header>
                    <sesionId>mySessionId</sesionId>
                    <serviceName>testService1</serviceName>
                </soapenv:Header>
                <soapenv:Body>
                    <request>
                        <dataInfo>data info example</dataInfo>
                        <otherData>other data example</otherData>
                    </request>
                </soapenv:Body>
            </soapenv:Envelope>
        ```
  
    - Puntos a tener en cuenta en esta configuracion:
      - En el campo **url** se debe poner la URL del servicio original sin el protocolo, dominio y puerto, [ver partes de una URL](#partes-de-una-url)
      - En vista de que con la misma URL se pueden consumir varios servicio, se puede generar un arreglo dentro del campo **source** con todos los servicio que queremos agrear al Dummy. El arreglo estara formado por las tuplas **servicename** y **responsePath**
        - El campo **servicename** se debe contener el nombre del servicio que se va a agregar al Dummy.
        - El campo **responsePath** indica la ruta dentro del paht **src/responses** en este proyecto, que contiene la respuesta ya sea JSON o XML que el Dummy entregará para el servicio especificado en el campo anterior. 
      - El campo **serviceNameTag** debe contener el tag XML o el atributo JSON que contiene el nombre del servicio en el request.
      - Para este caso de uso el campo **tag** no se usa, por lo que se estar vacio.
      - El campo **onlyPath** indica que usaremos una sola URL para consumir varios servicios por lo que debemos dejarlo en **true**
      - Para mas detalles de cada campo [Ver Definicion de un endpoint](#definicion-de-un-endpoint)
      - Una vez completado los cambios guardamos y reiniciamos el Dummy.
      - Para consumir el servicio que configuramos en Dummy, teniendo en cuenta que este se levanta en el puerto **3001** debemos consumir la URL:
          http://localhost:3001/mypath/service


# Configuracion Proxy
- El Proxy permite redirecciona la solicitud que le llegue hacia un servidor a hacia el Dummy, para esto, valida los servidores configurados y los dummies para estos servidores.
- **NOTA**: Esta version del Proxy solo permite el uso de **Servicios POST con una unica URL**
- Por lo tanto para configurar el Proxy es necesario configurar un servidor y un dummy de servidor.

- ## Definicion servers
  - Un server es la defincion del server que originalmente responde los servicios que queremos enrutar.
  - Lo servers se configuran dentro del archivo **src/config/serverProxy/proxyServersConfig.json**
  - Para definir un server es necesario tener claro los siguientes campos del server:
    - **server**: Nombre que le podremos a nuestro servidor dentro del Proxy.
    - **URL**: La URL del servicio original pero solo debe contener el protocolo, dominio y puerto.
    - **path**: Indica el URI o PATH sobre el que el Proxy capturará las peticiones, no podemos usar **/**, puesto que este esta reservado para el servidor Dummy.
    - **serviceTag**: Indica el tag XML o el atributo JSON que contiene el nombre del servicio en el request.
    - **encode**: Content-type del servicio original, por el momento solo soportamos **text/xml** y **application/xml**

- ## Definicion de un serverDummy
  - Un serverDummy es la definicion de los servicios del server que serán respondidos por el Proxy.
  - Los serverDummy se deben configurar dentro del archivo **src/config/serverProxy/proxyDummiesConfig.json**
  - Para definir un serverDummy es necesario tener claro los siguientes campos del serverDummy:
    - **path**:Debe coincidir con el campo **path** de la configuracion del server.
    - **serviceId**: es un arreglo de la lista de servicios que van a ser respondidos por el Dummy.

- ## Casos de uso:
- Por el momento este proyecto permite: 
  - Crear servidores a los que redireccionara el proxy
  - Crear un Dummy de los servicios de los servidores configurados en el proxy

- A continuacion se decriben ejemplos de los casos de uso:
  - ### Crear servidores a los que redireccionara el proxy
    - **Servidor por defecto**: Por defecto debe existir la defincion del servidor Dummy la configuracion ya se encuentra en el archivo  **src/config/serverProxy/proxyDummiesConfig.json** y es la siguiente:
      ```json
        {
            "server":"DUMMY",
            "URL":"http://localhost:3001",
            "path":"/",
            "serviceIdTag":"",
            "encode":"text/xml"
        }
      ```
      - Descripcion de los campos del servidor Dummy:
        - El campo **server** es el nombre por defecto para el servidor DUMMY
        - EL campo **URL** contiene la URL base (protocolo, dominio y puerto) del servidor Dummy
        - El campo **path** para el servidor Dummy debe tener el valor **/** ya que será el server por defecto.
        - El campo **serviceIdTag** para el servidor Dummy debe esta vacio
        - El campo **encode** indica el Content-type con el que se manejaran los request que van al Dummy

    -  **Registrar nuevo servidor en proxy** Para crear un servidor nuevo para ser manejado por el proxy, tomaremos siguiente URL de un servidor de ejemplo que expone servicio con una sola URL :
      - http://localhost:3011/TEST_SERVER
      - Este servidor expone tres servicios y el servicio que consumira depende del tag **serviceName** que viene dentro de cada request, los servicios que expone son:
        - testServerService1
        - testServerService3
        - testServerService3
    - En base a esta informacion configuraremos el server para el Proxy:
      ```json
          {
              "server":"TEST_SERVER",
              "URL":"http://localhost:3011",
              "path":"/TEST_SERVER",
              "serviceIdTag":"serviceName",
              "encode":"application/xml"
          }
        ```
      -  Puntos a tener en cuenta en esta configuracion:
         - El campo **server** es el nombre que le daremos a nuestro servidor, este valor es arbitrario pero no debe repetirse dentro de la configuracion.
         - EL campo **URL** contiene la URL base (protocolo, dominio y puerto) del servidor de ejemplo.
         - El campo **path** es la URL del servicio de prueba sin el protocolo, dominio y puerto.
         - El campo **serviceIdTag** Indicamos el tag del request que contien el nombre del servicio que se va a consumir
         - El campo **encode** indica el Content-type con el que se manejaran los request en el servidor de prueba

    - Para consumir el servicio pasando por el Proxy, teniendo en cuenta que este se levanta en el puerto **3021** debemos consumir la URL:
          http://localhost:3021/TEST_SERVER


# Demostración - pruebas
- **Recursos del demo**
  - Para poder realizar pruebas de este proyecto, se creo el sub-proyecto ServerTest, todos los archivos de este demo se encuentran en la carpeta **src/testResources** y se detallan a continuación:
    - **postman**
      - **dummyNode.postman_collection.json**: Este archivo contiene todos los request que se consumiran como parte de la prueba:
        - Los servicios del ServerTest
        - Los servicios configurados en Dummy
        - Los servicios para consumir el Proxy
    - **responses**: Las respuestas que usa el ServerTest, estas son respuestas predefinidas y se usan nada mas como ejemplo.
    - **serverTest.js**: Archivo de ejecución de ServerTest.

- **Levantar el servidor de test**
  - Ingresar por terminal al path donde está el proyecto y ejecutar:
    ```unix
    node src/testResources/serverTest.js
    ```
  - Esto levantará el ServerTest en el puerto 3011, y el path del servicio es **TEST_SERVER**, con la URL:
    http://localhost:3011/TEST_SERVER

- **Pruebas**
  - Con las configuraciones actuales en los archivos:
    - src/config/serverDummy/dummyConfig.json
    - src/config/serverProxy/proxyServersConfig.json
    - src/config/serverProxy/proxyDummiesConfig.json

  - Una vez levantado el ServerTest, el Dummy y el Proxy, podemos hacer varias pruebas que describiremos mas adelante.
  - La coleccion Postman antes mencionda sera la via para realizar las pruebas respectivas, a continuación describo los request existentes dentro de esta coleccion la cual esta organizada por carpetas:
    - **exampleDummy**: Todos los request dentro de esta carpeta consumen servicios de Dummy
      - GET
        - json
          - **getWithParams-json**: Consume un servicio GET que envia parámetros, este servicio usa formato JSON.
          - **getWithoutParams-json**: Consume un servicio GET que NO envia parámetros, este servicio usa formato JSON.
          - **getWithUrlParams-json**: Consume un servicio GET que envia parámetros como parte del path de la URL, este servicio usa formato JSON.
        - xml
          - **getWithoutParams-xml**: Consume un servicio GET que envia parámetros, este servicio usa formato XML.
          - **getWithParams-xml**: Consume un servicio GET que NO envia parámetros, este servicio usa formato XML.
          - **getWithUrlParams-xml**: Consume un servicio GET que envia parámetros como parte del path de la URL, este servicio usa formato XML.
      - POST
        - json
          - **postSpecificUrl-json**: Consume un servicio POST donde el servicio es parte de la URL, este servicio usa formato JSON.
          - **postOnlyPath-json**: Consume un servicio POST donde el servicio a consumir es indicado en algun atributo del request JSON.
        - xml
          - **postSpecificUrl-xml**:Consume un servicio POST donde el servicio es parte de la URL, este servicio usa formato XML.
          - **postOnlyPath-service1-xml**: Consume un servicio POST donde el servicio a consumir es indicado en algun tag del request XML.
          - **postOnlyPath-service2-xml**: Se planteo este ejemplo para complementar el anterior, consumiendo la mismas URL pero con un servicio diferente en el request.
  
    - **serverTest**: Todos los request dentro de esta carpeta consumen los servicios directamnete del ServerTest sin pasar por el Proxy ni ir al Dummy.
      - **service1**: Consume el primer servicio del ServerTest
      - **service2**: Consume el segundo servicio del ServerTest
      - **service3**: Consume el tercer servicio del ServerTest

    - **examplesProxy**: Todos los request dentro de esta carpeta consumen los servicios pasando por el Proxy.
      - serverTest
        - **service1ProxyToDummy**: Consume el primer servicio de ServerTest pasando por el Proxy, debido a que este servicio esta configurado en el proxy para redirigir a Dummy, la respuesta obtenida vendrá del Dummy.
        - **service2ProxyToDummy**: Consume el segundo servicio de ServerTest pasando por el Proxy, debido a que este servicio también esta configurado en el proxy para redirigir a Dummy, la respuesta obtenida vendrá del Dummy.
        - **service3ProxyToServerTest**: Consume el tercer servicio de ServerTest pasando por el Proxy, este servicio NO esta configurado en el proxy para redirigir a Dummy, por lo que la respuesta obtenida vendrá del ServerTest.



# Keywords
proxy dummy nodejs

</br></br></br></br></br>


# English documentation
</br>

# Description
This project is developed in JavaScript using NodeJS.
Its main function is to raise a Proxy and a Dummy, which is described below.
- **Proxy**: allows you to receive requests, analyze them, and redirect the request to the original server or the Dummy depending on the service indicated within the request.
- **Dummy**: allows you to define a response from a specific service, and accepts GET and POST methods. The dummy filters by URL, method, and service to consume, according to what you have configured.

# Instalation
- **Prerequisites**: This project was developed with the following versions:
  - node: 21.5.0
  - npm: 10.2.4
  - It is recommended to have these versions or higher versions for use.

- **Instalation**:
  - The installation will be done only once or to regenerate the 'node_modules' module import folder.
  - For this we enter the path where the project is via terminal and execute:
    ```unix
    npm install
    ```
# Quick Start
- ## Dummy
  - The dummy must be configured in the 'src/config/serverDummy/dummyConfig.json' file, for more details on how to do this go to the [Dummy Configuration](#dummy-configuration) section.

  - Enter on the path where the project is via terminal and execute:
      ```unix
      node index.js
      ```
  - NOTE: This will run the Dummy and the Proxy.
    - The dummy is run on port 3001: http://localhost:3001

- ## Proxy
  - The Proxy has two configuration files:
   - 'proxy Server Config.json': where the servers to which requests will be redirected are configured.
   - 'proxyDummiesConfig.json': where the services that go to dummy are configured.
   - For more details on how to do it, go to the [Proxy Configuration](#proxy-configuration) section

  - NOTE: This will run the Dummy and the Proxy.
   - The Proxy is run on port 3021: http://localhost:3021
   - For more configuration details go to the [Proxy Configuration] section (#proxy-configuration)

## Dummy configuration
- Initially and to better understand the document, will define the parts of a URL
- ## Parts of a URL
  - Will use the following URL as an example:
        http://example.com:80/mainPath/service?name=Peter
    Where:
  - http://: Protocol, is the protocol to use
  - example.com: Domain, is the domain of my URL
  - 80: Port, is the service port
  - mainPath/service: Path, is the path inside the server.
  - ?name=Peter: Parameters, It are the parameters sent in the URL

- The dummy validates the defined endpoints and generates a response based on that.
- Therefore, to configure the dummy it is necessary to configure an endpoint.
- ## Endpoint definition
  - To define an endpoint it is necessary to be clear about the following endpoint fields:
    - **method**: Request method can be 'GET' or 'POST'.
    - **url**: URL of the request, not including the protocol and domain.
    - **type**: Refers to Content-type of the request, this can be 'json' or 'xml'
      - The Content-type that the dummy accepts as part of the request header are:
        - **application/json** for JSON and in the 'type' field it will be defined as 'json'.
        - **application/xml** or **text/xml** for XML and in the 'type' field it will be defined as 'xml'.
    - **source**: It is an JSON array of the services and paths of the responses that the dummy will deliver, the data in the array has these fields:
      - **servicename**: This depends on the following:
        - If the service to be consumed is defined in the URL, the value 'only' will be used
        - If the service to be consumed is within the body of the request, the value must be the name of the service.
      - **responsePath**:
        - Indicates the path where the response file that will deliver the dummy for the respective service is located, this should be created inside of 'src/responses' folder
        - It is recommended to create a sub-folder for each project.
    - **serviceNameTag**: This depends on the following:
      - If the service to be consumed is defined in the URL, it should be left empty.
      - If the service's name to be consumed is within the request's body, the value must be the name of the XML tag or the JSON attribute in which the service's name to be consumed is found.
    - **tag**: This attribute is used to generate a dummy for GET services in which the parameters come as part of the URL, for example, in the URL: 
      - "http://localhost:3001/mydomain/json/user/Jhon/address/Miami"  
      - 'user' and 'address' are parameters of the service, then:
      - If the service is a GET service that sends the parameters as part of the URL, this field must have the following:
        - /mydomain/json/user/:user/address/:dir
      - If the service is **NOT** a GET service that sends the parameters as part of the URL, this field must be empty 
    - **status**: The HTTP code with which the dummy generates the response.
    - **delayTime**": If the response needs to take time to respond, this field must contain the number of seconds to wait before sending the response.
    - **onlyPath**: This field goes hand in hand with the 'servicename' subfield of the 'source' field and with the 'serviceNameTag' field
      - If the service to be consumed is defined in the URL, the value **true** will be used
      - Otherwise, it must be **false**

- ## Use cases:
- This project generates Dummy responses for the following cases:
  - GET services without parameters.
  - GET services with parameters.
  - GET services with parameters within the URL.
  - POST services with variable URL.
  - POST services with a single URL.

- Examples of use cases and how to configure them in the Dummy are described below:

  - ### GET services without parameters
   - These services have a fixed URL and do not send parameters, for example the following URL:
      http://myDomain:8080/mypath/getWithoutParams
   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"json",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.json"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"xml",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.xml"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/getWithoutParams


  - ### GET services with parameters
    - These services have a URL with a fixed Path but additionally send parameters after the **?** character, for example the following URL:
      http://myDomain:8080/mypath/getWithParams?param1=value1&param2=value2

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must put the URL of the original service without the protocol, domain, port, and eliminate the parameters, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/getWithParams?param1=value1&param2=value2

  - ### GET services with parameters within the URL
    - These services have a URL with a fixed Path but additionally, as part of the path, send parameters between the **/** character, for example, the following URL:
        http://myDomain:8080/mypath/user/Jhon/address/Miami
    
    - Passes as parameters **user** with the value **Jhon** and **address** with the value **Miami**

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must put the URL of the original service without the protocol, domain, port, and eliminate the parameters, [see Parts of a URL](#parts-of-a-url), and the parameters  must be assigned to variables indicating them with the character **:** and the arbitrary name of the variables.
        - For example URL: http://myDomain:8080/mypath/json/user/Jhon/address/Miami
        - We use the path: /mypath/json/
        - Concatenating with the parameter path and the definition of the variable for this parameter:
        - For the variable **user** we define the variable **:user**
        - For the variable **address** we define the variable **:dir**
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** field is not used, so it will be left empty.
      - For this case must use the **tag** field and must put the same value that we put in the **url** field
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
        http://localhost:3001/mypath/user/Jhon/address/Miami

  - ### POST services with variable URL
   - In these services each URL consumes a specific service:
      http://myDomain:8080/mypath/post/specific/service

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/post/specific/service


  - ### POST services with a single URL
    - These services expose a single URL and the service to be consumed comes in the body of the request either in an XML tag or in a JSON attribute if applicable. For example, we have the URL:
    
      http://myDomain:8080/mypath/service

    - This can expose several services but we want to generate a Dummy only for the services:
      - testService1
      - testService2

    - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"POST",
            "url":"/mypath/service",
            "type":"json",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.json"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.json"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
          }
      ```
      - We have a JSON request as a reference, where the name of the service comes as part of the request in the **serviceName** attribute
        ```json
            {
                "request": {
                    "header": {
                        "sesionId": "mySessionId",
                        "serviceName": "testService1"
                    },
                    "body": {
                            "dataInfo": "data info example",
                            "otherData":"other data example"
                    }
                }
            }
        ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"POST",
            "url":"/mypath/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.xml"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.xml"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
          }
      ```
      - We have an XML request as a reference, where the name of the service comes as part of the request in the **serviceName** attribute
        ```xml
            <soapenv:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
                <soapenv:Header>
                    <sesionId>mySessionId</sesionId>
                    <serviceName>testService1</serviceName>
                </soapenv:Header>
                <soapenv:Body>
                    <request>
                        <dataInfo>data info example</dataInfo>
                        <otherData>other data example</otherData>
                    </request>
                </soapenv:Body>
            </soapenv:Envelope>
        ```

    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      -  Because several services can be consumed with the same URL, an array can be generated inside of the **source** field with all the services that we want to add to the Dummy. The array will be formed by the tuples **servicename** and **responsePath**
         - The **servicename** field must contain the name of the service that will be added to the Dummy.
         - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response either JSON or XML that the Dummy will deliver for the service specified in the previous field.
      - The **serviceNameTag** field must contain the XML tag or the JSON attribute that contains the name of the service in the request.
      - For this use case the **tag** field is not used, so it will be empty.
      - The **onlyPath** field indicates that we will use a single URL to consume several services so we must leave it at **true**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/service

---------------------------------------------------------
## Proxy configuration
- The Proxy allows you to redirect the request that arrives at a server to the Dummy, for this, it validates the configured servers and the dummies for these servers.
- **NOTE**: This version of the Proxy only allows the use of **POST Services with a single URL**
- Therefore, to configure the Proxy it is necessary to configure a server and a server dummy.

- ## Definition servers
  - A server is the definition of the server that originally responds to the services we want to route.
  - The servers are configured within the file **src/config/serverProxy/proxyServersConfig.json**
  - To define a server it is necessary to be clear about the following server fields:
  - **server**: Name that can be given to our server within the Proxy.
  - **URL**: The URL of the original service but it should only contain the protocol, domain, and port.
  - **path**: Indicates the URI or PATH over which the Proxy will capture the requests, we cannot use **/**, since this is reserved for the Dummy server.
  - **serviceTag**: Indicates the XML tag or JSON attribute that contains the name of the service in the request.
  - **encode**: Content-type of the original service, at the moment we only support **text/xml** and **application/xml**

- ## Definition of a serverDummy
 - A serverDummy is the definition of the server services that will be responded to by the Proxy.
 - A serverDummy must be configured within the file **src/config/serverProxy/proxyDummiesConfig.json**
 - To define a serverDummy it is necessary to be clear about the following serverDummy fields:
 - **path**:Must match the **path** field of the server configuration.
 - **serviceId**: is an arrangement of the list of services that will be responded to by the Dummy.

- ## Use cases:
- On this version, this project allows:
  - Create servers to which the proxy will redirect
  - Create a Dummy of the services of the servers configured in the proxy.

- Examples of use cases are described below:
  - ### Create servers to which the proxy will redirect
    - **Default server** By default, the Dummy server definition must exist, the configuration is already found in the file **src/config/serverProxy/proxyDummiesConfig.json** and is as follows:
      ```json
        {
            "server":"DUMMY",
            "URL":"http://localhost:3001",
            "path":"/",
            "serviceIdTag":"",
            "encode":"text/xml"
        }
      ```
      - Description of the Dummy server fields:
        - The **server** field is the default name for the DUMMY server.
        - The **URL** field contains the base URL (protocol, domain, and port) of the Dummy server.
        - The **path** field for the Dummy server must have the value **/** since it will be the default server.
        - The **serviceIdTag** field for the Dummy server must be empty.
        - The **encode** field indicates the Content-type with which the requests that go to the Dummy will be handled.

      - **Register new server in proxy** To create a new server to be handled by the proxy, we will take the following URL of an example server that exposes service with a single URL:
        - http://localhost:3011/TEST_SERVER
        - This server exposes three services and the service it consumes depends on the **serviceName** tag that comes within each request, the services it exposes are:
          - testServerService1
          - testServerService3
          - testServerService3
      - Based on this information we will configure the server for the Proxy:
        ```json
          {
              "server":"TEST_SERVER",
              "URL":"http://localhost:3011",
              "path":"/TEST_SERVER",
              "serviceIdTag":"serviceName",
              "encode":"application/xml"
          }
        ```

      - Points to take into account in this configuration:
        - The **server** field is the name that we will give to our server, this value is arbitrary but should not be repeated within the configuration.
        - The **URL** field contains the base URL (protocol, domain, and port) of the example server.
        - The **path** field is the URL of the test service without the protocol, domain, and port.
        - The **serviceIdTag** field indicates the request tag that contains the name of the service that is going to be consumed.
        - The **encode** field indicates the Content-type with which requests will be handled on the test server

    - To consume the service through the Proxy, taking into account that it is set up on port **3021** we must consume the URL:
     http://localhost:3021/TEST_SERVER


# Demo - tests
- **Demo Resources**
  - To test this project, the ServerTest subproject was created, all the files for this demo are located in the **src/testResources** folder, and are detailed below:
    - **postman**
      - **dummyNode.postman_collection.json**: This file contains all the requests that will be consumed as part of the test:
        - ServerTest services
        - Services configured in Dummy
        - Services to consume through the Proxy
    - **responses**: The responses used by ServerTest, are predefined and used only as an example.
    - **serverTest.js**: ServerTest execution file.

- **Turn up the test server**
  - Enter through the terminal to the path where the project is and execute:
  ```unix
    node src/testResources/serverTest.js
  ```
  - This starts the serverTest on port 3011, and the service path is **TEST_SERVER**, with the URL:
      http://localhost:3011/TEST_SERVER

- **Test**
  - With current settings in the files:
    - src/config/serverDummy/dummyConfig.json
    - src/config/serverProxy/proxyServersConfig.json
    - src/config/serverProxy/proxyDummiesConfig.json

  - Once the ServerTest, Dummy, and Proxy have been started, we can do several tests.
  - The Postman collection mentioned above will be the way to carry out the respective tests, below describe the existing requests within this collection which is organized by folders:

    - **exampleDummy**: All requests inside this folder consume Dummy services
      - GET
        - json
          - **getWithParams-json**: Consumes a GET service that sends parameters, this service uses JSON format.
          - **getWithoutParams-json**: Consumes a GET service that does NOT send parameters, this service uses JSON format.
          - **getWithUrlParams-json**: Consumes a GET service that sends parameters as part of the URL path, this service uses JSON format.
        - xml
          - **getWithoutParams-xml**: Consumes a GET service that sends parameters, this service uses XML format.
          - **getWithParams-xml**: Consumes a GET service that does NOT send parameters, this service uses XML format.
          - **getWithUrlParams-xml**: Consumes a GET service that sends parameters as part of the URL path, this service uses XML format.
      - POST
        - json
          - **postSpecificUrl-json**: Consumes a POST service where the service is part of the URL, this service uses JSON format.
          - **postOnlyPath-json**: Consumes a POST service where the service to be consumed is indicated in some attribute of the JSON request.
        - xml
          - **postSpecificUrl-xml**:Consumes a POST service where the service is part of the URL, this service uses XML format.
          - **postOnlyPath-service1-xml**: Consumes a POST service where the service to be consumed is indicated in some tag of the XML request.
          - **postOnlyPath-service2-xml**: This example was proposed to complement the previous one, consuming the same URL but with a different service in the request.

    - **serverTest**: All requests within this folder consume the services directly from ServerTest without going through the Proxy or the Dummy.
      - **service1**: Consumes the first service of ServerTest
      - **service2**: Consumes the second service of ServerTest
      - **service3**: Consumes the third service of ServerTest

    - **examplesProxy**: All requests within this folder consume the services passing through the Proxy.
      - serverTest
        - **service1ProxyToDummy**: Consumes the first ServerTest service passing through the Proxy, cause this service is configured in the proxy to redirect to Dummy, the response obtained will come from the Dummy.
        - **service2ProxyToDummy**: Consumes the second ServerTest service passing through the Proxy, cause this service is also configured in the proxy to redirect to Dummy, the response obtained will come from the Dummy.
        - **service3ProxyToServerTest**: Consumes the third ServerTest service passing through the Proxy, this service is NOT configured in the proxy to redirect to Dummy, so the response obtained will come from ServerTest.


# Keywords
proxy dummy nodejs

---

# English documentation
# Description
This project is developed in JavaScript using NodeJS.
Its main function is to raise a Proxy and a Dummy, which is described below.
- **Proxy**: allows you to receive requests, analyze them, and redirect the request to the original server or the Dummy depending on the service indicated within the request.
- **Dummy**: allows you to define a response from a specific service, and accepts GET and POST methods. The dummy filters by URL, method, and service to consume, according to what you have configured.

# Instalation
- **Prerequisites**: This project was developed with the following versions:
  - node: 21.5.0
  - npm: 10.2.4
  - It is recommended to have these versions or higher versions for use.

- **Instalation**:
  - The installation will be done only once or to regenerate the 'node_modules' module import folder.
  - For this we enter the path where the project is via terminal and execute:
    ```unix
    npm install
    ```
# Quick Start
- ## Dummy
  - The dummy must be configured in the 'src/config/serverDummy/dummyConfig.json' file, for more details on how to do this go to the [Dummy Configuration](#dummy-configuration) section.

  - Enter on the path where the project is via terminal and execute:
      ```unix
      node index.js
      ```
  - NOTE: This will run the Dummy and the Proxy.
    - The dummy is run on port 3001: http://localhost:3001

- ## Proxy
  - The Proxy has two configuration files:
   - 'proxy Server Config.json': where the servers to which requests will be redirected are configured.
   - 'proxyDummiesConfig.json': where the services that go to dummy are configured.
   - For more details on how to do it, go to the [Proxy Configuration](#proxy-configuration) section

  - NOTE: This will run the Dummy and the Proxy.
   - The Proxy is run on port 3021: http://localhost:3021
   - For more configuration details go to the [Proxy Configuration] section (#proxy-configuration)

## Dummy configuration
- Initially and to better understand the document, will define the parts of a URL
- ## Parts of a URL
  - Will use the following URL as an example:
        http://example.com:80/mainPath/service?name=Peter
    Where:
  - http://: Protocol, is the protocol to use
  - example.com: Domain, is the domain of my URL
  - 80: Port, is the service port
  - mainPath/service: Path, is the path inside the server.
  - ?name=Peter: Parameters, It are the parameters sent in the URL

- The dummy validates the defined endpoints and generates a response based on that.
- Therefore, to configure the dummy it is necessary to configure an endpoint.
- ## Endpoint definition
  - To define an endpoint it is necessary to be clear about the following endpoint fields:
    - **method**: Request method can be 'GET' or 'POST'.
    - **url**: URL of the request, not including the protocol and domain.
    - **type**: Refers to Content-type of the request, this can be 'json' or 'xml'
      - The Content-type that the dummy accepts as part of the request header are:
        - **application/json** for JSON and in the 'type' field it will be defined as 'json'.
        - **application/xml** or **text/xml** for XML and in the 'type' field it will be defined as 'xml'.
    - **source**: It is an JSON array of the services and paths of the responses that the dummy will deliver, the data in the array has these fields:
      - **servicename**: This depends on the following:
        - If the service to be consumed is defined in the URL, the value 'only' will be used
        - If the service to be consumed is within the body of the request, the value must be the name of the service.
      - **responsePath**:
        - Indicates the path where the response file that will deliver the dummy for the respective service is located, this should be created inside of 'src/responses' folder
        - It is recommended to create a sub-folder for each project.
    - **serviceNameTag**: This depends on the following:
      - If the service to be consumed is defined in the URL, it should be left empty.
      - If the service's name to be consumed is within the request's body, the value must be the name of the XML tag or the JSON attribute in which the service's name to be consumed is found.
    - **tag**: This attribute is used to generate a dummy for GET services in which the parameters come as part of the URL, for example, in the URL: 
      - "http://localhost:3001/mydomain/json/user/Jhon/address/Miami"  
      - 'user' and 'address' are parameters of the service, then:
      - If the service is a GET service that sends the parameters as part of the URL, this field must have the following:
        - /mydomain/json/user/:user/address/:dir
      - If the service is **NOT** a GET service that sends the parameters as part of the URL, this field must be empty 
    - **status**: The HTTP code with which the dummy generates the response.
    - **delayTime**": If the response needs to take time to respond, this field must contain the number of seconds to wait before sending the response.
    - **onlyPath**: This field goes hand in hand with the 'servicename' subfield of the 'source' field and with the 'serviceNameTag' field
      - If the service to be consumed is defined in the URL, the value **true** will be used
      - Otherwise, it must be **false**

- ## Use cases:
- This project generates Dummy responses for the following cases:
  - GET services without parameters.
  - GET services with parameters.
  - GET services with parameters within the URL.
  - POST services with variable URL.
  - POST services with a single URL.

- Examples of use cases and how to configure them in the Dummy are described below:

  - ### GET services without parameters
   - These services have a fixed URL and do not send parameters, for example the following URL:
      http://myDomain:8080/mypath/getWithoutParams
   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"json",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.json"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
              "method":"GET",
              "url":"/mypath/getWithoutParams",
              "type":"xml",
              "source": [
                  {
                      "servicename":"only",
                      "responsePath":"examples/rsGetWithoutParamsExample.xml"
                  }
              ],
              "serviceNameTag":"",
              "tag":"",
              "status":200,
              "delayTime":0,
              "onlyPath":false
          }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/getWithoutParams


  - ### GET services with parameters
    - These services have a URL with a fixed Path but additionally send parameters after the **?** character, for example the following URL:
      http://myDomain:8080/mypath/getWithParams?param1=value1&param2=value2

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"GET",
            "url":"/mypath/getWithParams",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must put the URL of the original service without the protocol, domain, port, and eliminate the parameters, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/getWithParams?param1=value1&param2=value2

  - ### GET services with parameters within the URL
    - These services have a URL with a fixed Path but additionally, as part of the path, send parameters between the **/** character, for example, the following URL:
        http://myDomain:8080/mypath/user/Jhon/address/Miami
    
    - Passes as parameters **user** with the value **Jhon** and **address** with the value **Miami**

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
        {
            "method":"GET",
            "url":"/mypath/user/:user/address/:dir",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsGetWithUrlParamsExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"/mypath/user/:user/address/:dir",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must put the URL of the original service without the protocol, domain, port, and eliminate the parameters, [see Parts of a URL](#parts-of-a-url), and the parameters  must be assigned to variables indicating them with the character **:** and the arbitrary name of the variables.
        - For example URL: http://myDomain:8080/mypath/json/user/Jhon/address/Miami
        - We use the path: /mypath/json/
        - Concatenating with the parameter path and the definition of the variable for this parameter:
        - For the variable **user** we define the variable **:user**
        - For the variable **address** we define the variable **:dir**
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** field is not used, so it will be left empty.
      - For this case must use the **tag** field and must put the same value that we put in the **url** field
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
        http://localhost:3001/mypath/user/Jhon/address/Miami

  - ### POST services with variable URL
   - In these services each URL consumes a specific service:
      http://myDomain:8080/mypath/post/specific/service

   - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"json",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.json"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"POST",
            "url":"/mypath/post/specific/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"only",
                    "responsePath":"examples/rsPostSpecificServiceExample.xml"
                }
            ],
            "serviceNameTag":"",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":false
        }
      ```
    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      - Since the URL consumes a specific service, the **servicename** field must be set to **only**
      - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response, either JSON or XML, that will be delivered by the Dummy for this service.
      - In this case, the **serviceNameTag** and **tag** fields are not used, so they will be left empty.
      - The **onlyPath** field is not used for this use case so we must leave it at **false**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/post/specific/service


  - ### POST services with a single URL
    - These services expose a single URL and the service to be consumed comes in the body of the request either in an XML tag or in a JSON attribute if applicable. For example, we have the URL:
    
      http://myDomain:8080/mypath/service

    - This can expose several services but we want to generate a Dummy only for the services:
      - testService1
      - testService2

    - The following would be the dummy configuration of this service in the case of **JSON**
      ```json
          {
            "method":"POST",
            "url":"/mypath/service",
            "type":"json",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.json"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.json"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
          }
      ```
      - We have a JSON request as a reference, where the name of the service comes as part of the request in the **serviceName** attribute
        ```json
            {
                "request": {
                    "header": {
                        "sesionId": "mySessionId",
                        "serviceName": "testService1"
                    },
                    "body": {
                            "dataInfo": "data info example",
                            "otherData":"other data example"
                    }
                }
            }
        ```

    - The following is the dummy configuration of this service in the case of **XML**
      ```json
          {
            "method":"POST",
            "url":"/mypath/service",
            "type":"xml",
            "source": [
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService1Dummy.xml"
                },
                {
                    "servicename":"testService1",
                    "responsePath":"examples/rsService2Dummy.xml"
                }
            ],
            "serviceNameTag":"serviceName",
            "tag":"",
            "status":200,
            "delayTime":0,
            "onlyPath":true
          }
      ```
      - We have an XML request as a reference, where the name of the service comes as part of the request in the **serviceName** attribute
        ```xml
            <soapenv:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
                <soapenv:Header>
                    <sesionId>mySessionId</sesionId>
                    <serviceName>testService1</serviceName>
                </soapenv:Header>
                <soapenv:Body>
                    <request>
                        <dataInfo>data info example</dataInfo>
                        <otherData>other data example</otherData>
                    </request>
                </soapenv:Body>
            </soapenv:Envelope>
        ```

    - Points to consider in this configuration:
      - In the **url** field you must enter the URL of the original service without the protocol, domain, and port, [see Parts of a URL](#parts-of-a-url)
      -  Because several services can be consumed with the same URL, an array can be generated inside of the **source** field with all the services that we want to add to the Dummy. The array will be formed by the tuples **servicename** and **responsePath**
         - The **servicename** field must contain the name of the service that will be added to the Dummy.
         - The **responsePath** field indicates the path within the **src/responses** path in this project, which contains the response either JSON or XML that the Dummy will deliver for the service specified in the previous field.
      - The **serviceNameTag** field must contain the XML tag or the JSON attribute that contains the name of the service in the request.
      - For this use case the **tag** field is not used, so it will be empty.
      - The **onlyPath** field indicates that we will use a single URL to consume several services so we must leave it at **true**
      - For more details of each field [See Endpoint definition](#endpoint-definition)
      - Once the changes are completed, we save and restart the Dummy.
    - To consume the service that we configured in Dummy, taking into account that it is created on port **3001** we must consume the URL:
      http://localhost:3001/mypath/service

---------------------------------------------------------
## Proxy configuration
- The Proxy allows you to redirect the request that arrives at a server to the Dummy, for this, it validates the configured servers and the dummies for these servers.
- **NOTE**: This version of the Proxy only allows the use of **POST Services with a single URL**
- Therefore, to configure the Proxy it is necessary to configure a server and a server dummy.

- ## Definition servers
  - A server is the definition of the server that originally responds to the services we want to route.
  - The servers are configured within the file **src/config/serverProxy/proxyServersConfig.json**
  - To define a server it is necessary to be clear about the following server fields:
  - **server**: Name that can be given to our server within the Proxy.
  - **URL**: The URL of the original service but it should only contain the protocol, domain, and port.
  - **path**: Indicates the URI or PATH over which the Proxy will capture the requests, we cannot use **/**, since this is reserved for the Dummy server.
  - **serviceTag**: Indicates the XML tag or JSON attribute that contains the name of the service in the request.
  - **encode**: Content-type of the original service, at the moment we only support **text/xml** and **application/xml**

- ## Definition of a serverDummy
 - A serverDummy is the definition of the server services that will be responded to by the Proxy.
 - A serverDummy must be configured within the file **src/config/serverProxy/proxyDummiesConfig.json**
 - To define a serverDummy it is necessary to be clear about the following serverDummy fields:
 - **path**:Must match the **path** field of the server configuration.
 - **serviceId**: is an arrangement of the list of services that will be responded to by the Dummy.

- ## Use cases:
- On this version, this project allows:
  - Create servers to which the proxy will redirect
  - Create a Dummy of the services of the servers configured in the proxy.

- Examples of use cases are described below:
  - ### Create servers to which the proxy will redirect
    - **Default server** By default, the Dummy server definition must exist, the configuration is already found in the file **src/config/serverProxy/proxyDummiesConfig.json** and is as follows:
      ```json
        {
            "server":"DUMMY",
            "URL":"http://localhost:3001",
            "path":"/",
            "serviceIdTag":"",
            "encode":"text/xml"
        }
      ```
      - Description of the Dummy server fields:
        - The **server** field is the default name for the DUMMY server.
        - The **URL** field contains the base URL (protocol, domain, and port) of the Dummy server.
        - The **path** field for the Dummy server must have the value **/** since it will be the default server.
        - The **serviceIdTag** field for the Dummy server must be empty.
        - The **encode** field indicates the Content-type with which the requests that go to the Dummy will be handled.

      - **Register new server in proxy** To create a new server to be handled by the proxy, we will take the following URL of an example server that exposes service with a single URL:
        - http://localhost:3011/TEST_SERVER
        - This server exposes three services and the service it consumes depends on the **serviceName** tag that comes within each request, the services it exposes are:
          - testServerService1
          - testServerService3
          - testServerService3
      - Based on this information we will configure the server for the Proxy:
        ```json
          {
              "server":"TEST_SERVER",
              "URL":"http://localhost:3011",
              "path":"/TEST_SERVER",
              "serviceIdTag":"serviceName",
              "encode":"application/xml"
          }
        ```

      - Points to take into account in this configuration:
        - The **server** field is the name that we will give to our server, this value is arbitrary but should not be repeated within the configuration.
        - The **URL** field contains the base URL (protocol, domain, and port) of the example server.
        - The **path** field is the URL of the test service without the protocol, domain, and port.
        - The **serviceIdTag** field indicates the request tag that contains the name of the service that is going to be consumed.
        - The **encode** field indicates the Content-type with which requests will be handled on the test server

    - To consume the service through the Proxy, taking into account that it is set up on port **3021** we must consume the URL:
     http://localhost:3021/TEST_SERVER


# Demo - tests
- **Demo Resources**
  - To test this project, the ServerTest subproject was created, all the files for this demo are located in the **src/testResources** folder, and are detailed below:
    - **postman**
      - **dummyNode.postman_collection.json**: This file contains all the requests that will be consumed as part of the test:
        - ServerTest services
        - Services configured in Dummy
        - Services to consume through the Proxy
    - **responses**: The responses used by ServerTest, are predefined and used only as an example.
    - **serverTest.js**: ServerTest execution file.

- **Turn up the test server**
  - Enter through the terminal to the path where the project is and execute:
  ```unix
    node src/testResources/serverTest.js
  ```
  - This starts the serverTest on port 3011, and the service path is **TEST_SERVER**, with the URL:
      http://localhost:3011/TEST_SERVER

- **Test**
  - With current settings in the files:
    - src/config/serverDummy/dummyConfig.json
    - src/config/serverProxy/proxyServersConfig.json
    - src/config/serverProxy/proxyDummiesConfig.json

  - Once the ServerTest, Dummy, and Proxy have been started, we can do several tests.
  - The Postman collection mentioned above will be the way to carry out the respective tests, below describe the existing requests within this collection which is organized by folders:

    - **exampleDummy**: All requests inside this folder consume Dummy services
      - GET
        - json
          - **getWithParams-json**: Consumes a GET service that sends parameters, this service uses JSON format.
          - **getWithoutParams-json**: Consumes a GET service that does NOT send parameters, this service uses JSON format.
          - **getWithUrlParams-json**: Consumes a GET service that sends parameters as part of the URL path, this service uses JSON format.
        - xml
          - **getWithoutParams-xml**: Consumes a GET service that sends parameters, this service uses XML format.
          - **getWithParams-xml**: Consumes a GET service that does NOT send parameters, this service uses XML format.
          - **getWithUrlParams-xml**: Consumes a GET service that sends parameters as part of the URL path, this service uses XML format.
      - POST
        - json
          - **postSpecificUrl-json**: Consumes a POST service where the service is part of the URL, this service uses JSON format.
          - **postOnlyPath-json**: Consumes a POST service where the service to be consumed is indicated in some attribute of the JSON request.
        - xml
          - **postSpecificUrl-xml**:Consumes a POST service where the service is part of the URL, this service uses XML format.
          - **postOnlyPath-service1-xml**: Consumes a POST service where the service to be consumed is indicated in some tag of the XML request.
          - **postOnlyPath-service2-xml**: This example was proposed to complement the previous one, consuming the same URL but with a different service in the request.

    - **serverTest**: All requests within this folder consume the services directly from ServerTest without going through the Proxy or the Dummy.
      - **service1**: Consumes the first service of ServerTest
      - **service2**: Consumes the second service of ServerTest
      - **service3**: Consumes the third service of ServerTest

    - **examplesProxy**: All requests within this folder consume the services passing through the Proxy.
      - serverTest
        - **service1ProxyToDummy**: Consumes the first ServerTest service passing through the Proxy, cause this service is configured in the proxy to redirect to Dummy, the response obtained will come from the Dummy.
        - **service2ProxyToDummy**: Consumes the second ServerTest service passing through the Proxy, cause this service is also configured in the proxy to redirect to Dummy, the response obtained will come from the Dummy.
        - **service3ProxyToServerTest**: Consumes the third ServerTest service passing through the Proxy, this service is NOT configured in the proxy to redirect to Dummy, so the response obtained will come from ServerTest.


# Keywords
proxy dummy nodejs




