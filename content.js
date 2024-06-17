
//Esta funcion srive para injectar los scripts en el html de la pagina web
function injectScript(file, tag, id) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file);
    script.setAttribute('id', id);
    node.appendChild(script);
}

//Esta funcion recopila todos los script/librerias que deben injectarse en la pagina web y los injecta a la vez
function injectScripts() {

    injectScript(chrome.runtime.getURL('libs/socket.io.js'), 'body', "socket.io");

    var script = document.getElementById('socket.io');
    script.addEventListener('load', function () {

        injectScript(chrome.runtime.getURL('socket_exchange.js'), 'body', "sendsocket");

    });
    injectScript(chrome.runtime.getURL('libs/jquery-3.5.1.min.js'), 'body', "jquery");
    injectScript(chrome.runtime.getURL('register.js'), 'body', "register");
    injectScript(chrome.runtime.getURL('libs/dialogflow.js'), 'body', "dialogflow");
    injectScript(chrome.runtime.getURL('libs/face-api.js'), 'body', "face-api");

    console.debug("Librerias cargadas");

}

//En Kodular al injectar Registro peta, no se si sera por el nombre de la clase pero entra en conflicto con su clase js de material design

//Cuando carge la pagina de AI2----
window.onload = function () {


    injectScripts();

    chrome.storage.sync.set({
        automatic_evaluation: false
    });

    chrome.storage.sync.set({
        project_guided_name: "none"
    });

    //Me aseguro que el usuario ha complimentado el formulario inicial de la extension
    chrome.storage.sync.get(['auth'], function (result) {

        //console.log(result.auth);

        if (result.auth) {
            //injecto el script/listener principal
           
            injectScript(chrome.runtime.getURL('listeners/global_listener.js'), 'body');
            injectScript(chrome.runtime.getURL('listeners/face_expression_listener.js'), 'body', 'face_expression_listener');
           
            console.debug("Listener global cargado");
        } else {
            alert("To use NAVI Assistant you must accept the conditions of the initial form");
        }

    });

};

//Centralita de mensajes que llegan de otros scripts de la extension
window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    //Si me llega un mensaje del servidor...    
    if (event.data.type && (event.data.type == "FROM_SERVER")) {

        //si el usuario cambia de proyecto de AI2 recargo la pagina por si las moscas
        if (event.data.msg.type == "project_changed") {

            location.reload();


        } else {

            //Mando el mensaje al chatbot para que se mustre alli
            window.postMessage({ type: "DIALOG_MESSAGE", msg: event.data.msg }, "*");
        }


    }

    //Si es una interaccion con la plataforma lo que recibo, le añado los campos del usuario y lo mando al servidor
    if (event.data.type && (event.data.type == "INTERACTION_LOG")) {

        //CON ESTA FUNCION DEBO PASAR EL OBJETO REGISTER A BACKGROUND PARA LA COMUNICACION CON EL SERVER

        //window.postMessage({ type: "FACE_DETECTION"}, "*")

        
        let register = Object.assign(new Register(), event.data.register);

        let user = Object.assign(new User(), register.user);

        chrome.storage.sync.get(['age', 'gender', 'education', 'experience', 'project_guided_name', 'lang'], function (result) {


            user.age = result.age;
            user.gender = result.gender;
            user.education = result.education;
            user.experience = result.experience;
            user.lang = result.lang;

            register.project_guided = result.project_guided_name;
            register.user = user;

            //Lo mando a socket_exchange para que lo mande al server
            window.postMessage({ type: "SEND_TO_SERVER", msg: register }, "*");


        });

    }

    if (event.data.type && (event.data.type == "CHANGE_AUTOMATIC_EVALUATION")) {

        chrome.storage.sync.set({
            automatic_evaluation: event.data.automatic_evaluation
        });
        //automatic_evaluation = event.data.automatic_evaluation;

    }

    if (event.data.type && (event.data.type == "INIT_IMAGE_CAPTURE")) {

        chrome.runtime.sendMessage({msg:"hola"}, function(response) {

        });

    }

    if (event.data.type && (event.data.type == "CHANGE_PROJECT_GUIDED")) {

        chrome.storage.sync.set({
            project_guided_name: event.data.project_guided_name
        });
        //automatic_evaluation = event.data.automatic_evaluation;

    }

    //Si el usuario ha cambiado el idioma, almaceno mi nueva variable de idioma y recargo la pagina
    if (event.data.type && (event.data.type == "RELOAD_CHATBOT")) {

        chrome.storage.sync.set({
            lang: event.data.lang
        });

        window.location.search="?locale="+event.data.lang.toLowerCase()+"_"+event.data.lang.toUpperCase();
        //location.reload();

    }

    if (event.data.type && (event.data.type == "INJECT_BLOCK_LISTENER")) {

        injectScript(chrome.runtime.getURL('listeners/block_listener.js'), 'body', 'block_listener');
        
        console.debug("Listener de bloques cargado");

    }
    if (event.data.type && (event.data.type == "INJECT_DIALOGFLOW")) {

        injectScript(chrome.runtime.getURL('listeners/dialog_listener.js'), 'body', 'dialog_listener');

        console.debug("Listener de Dialogflow cargado");


        //Cuando me aseguro que dialog_listener esta cargado, cojo el valor del lenguaje que tiene el usuario y mando un mensaje a dialog_listener para que cree el chatbot
        var script = document.getElementById('dialog_listener');

        //Esto solo se ejecutara cuando el script este cargado
        script.addEventListener('load', function () {

            chrome.storage.sync.get(['lang'], function (result) {

                window.postMessage({ type: "INIT_DIALOGFLOW", msg:{icon:chrome.runtime.getURL('icons/icon32.png'),lang: result.lang,css:chrome.runtime.getURL('df.css')}}, "*");

            });


        });
    }
    if (event.data.type && (event.data.type == "INJECT_UI_LISTENER")) {

        injectScript(chrome.runtime.getURL('listeners/interface_listener.js'), 'body', 'interface_listener');

        window.postMessage({ type: "INIT_FACE_RECOGNITION", msg:{models:chrome.runtime.getURL('models')}}, "*");

        console.debug("Listener de interfaz cargado");

    }
    if (event.data.type && (event.data.type == "INJECT_COMPONENT_LISTENER")) {

        injectScript(chrome.runtime.getURL('listeners/component_listener.js'), 'body', 'component_listener');

        console.debug("Listener de componentes cargado");

    }
});