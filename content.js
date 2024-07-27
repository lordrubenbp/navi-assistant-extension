
function injectScript(file, tag, id) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file);
    script.setAttribute('id', id);
    node.appendChild(script);
}

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


window.onload = function () {


    injectScripts();

    chrome.storage.sync.set({
        automatic_evaluation: false
    });

    chrome.storage.sync.set({
        project_guided_name: "none"
    });

    chrome.storage.sync.get(['auth'], function (result) {


        if (result.auth) {
           
            injectScript(chrome.runtime.getURL('listeners/global_listener.js'), 'body');
            injectScript(chrome.runtime.getURL('listeners/face_expression_listener.js'), 'body', 'face_expression_listener');
           
            console.debug("Listener global cargado");
        } else {
            alert("To use NAVI Assistant you must accept the conditions of the initial form");
        }

    });

};

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_SERVER")) {

        if (event.data.msg.type == "project_changed") {

            location.reload();


        } else {

            //Mando el mensaje al chatbot para que se mustre alli
            window.postMessage({ type: "DIALOG_MESSAGE", msg: event.data.msg }, "*");
        }


    }

    if (event.data.type && (event.data.type == "INTERACTION_LOG")) {
        
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

            window.postMessage({ type: "SEND_TO_SERVER", msg: register }, "*");


        });

    }

    if (event.data.type && (event.data.type == "CHANGE_AUTOMATIC_EVALUATION")) {

        chrome.storage.sync.set({
            automatic_evaluation: event.data.automatic_evaluation
        });

    }

    if (event.data.type && (event.data.type == "INIT_IMAGE_CAPTURE")) {

        chrome.runtime.sendMessage({msg:"hola"}, function(response) {

        });

    }

    if (event.data.type && (event.data.type == "CHANGE_PROJECT_GUIDED")) {

        chrome.storage.sync.set({
            project_guided_name: event.data.project_guided_name
        });

    }

    if (event.data.type && (event.data.type == "RELOAD_CHATBOT")) {

        chrome.storage.sync.set({
            lang: event.data.lang
        });

        window.location.search="?locale="+event.data.lang.toLowerCase()+"_"+event.data.lang.toUpperCase();

    }

    if (event.data.type && (event.data.type == "INJECT_BLOCK_LISTENER")) {

        injectScript(chrome.runtime.getURL('listeners/block_listener.js'), 'body', 'block_listener');
        
        console.debug("Listener de bloques cargado");

    }
    if (event.data.type && (event.data.type == "INJECT_DIALOGFLOW")) {

        injectScript(chrome.runtime.getURL('listeners/dialog_listener.js'), 'body', 'dialog_listener');

        console.debug("Listener de Dialogflow cargado");


        var script = document.getElementById('dialog_listener');

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