var bubble = document.createElement("div");
var bubble_container = document.createElement("div");
var bubble_text = document.createElement("p");
var color_box=document.createElement("span");
var pg_active = false;
window.addEventListener("message", function (event) {

    if (event.source != window)
        return;
    if (event.data.type && (event.data.type == "INIT_DIALOGFLOW")) {

        createMessenger(event.data.msg.lang, event.data.msg.icon, event.data.msg.css);
        showServerResponse();

        console.debug("Chatbot creado");

    } else if (event.data.type && (event.data.type == "CLOSE_CHATBOT")) {

        openHideTutorialBar();
    }

});

function animateTutorialBar() {

    $('#tutorial_bar_text').animate({
        'opacity': 0.7,
        'paddingLeft': "+=0.2rem"
    }, 400, function () {
        $('#tutorial_bar_text').animate({
            'opacity': 1,
            'paddingLeft': "-=0.2rem"
        }, 400);
    });

}

function openHideTutorialBar() {

    if (pg_active == true && bubble_text.innerHTML != "") {

        if ($r1.getAttribute("expand") == null) {

            bubble_container.style.display = "block";
            $('#tutorial_bar_text').fadeIn();

        } else {

            bubble_container.style.display = "none";
            $('#tutorial_bar_text').fadeOut();

        }
    }

}

function createMessenger(lang, icon, css) {

    try {

        var meta = document.createElement('meta');
        document.head.appendChild(meta);
        meta.setAttribute("name", "viewport");
        meta.setAttribute("content", "width=device-width, initial-scale=1");

        var dfcss = document.createElement('link');
        dfcss.setAttribute("rel", "stylesheet");
        dfcss.setAttribute("type", "text/css");
        dfcss.setAttribute("href", css);
        document.head.appendChild(dfcss);


        bubble_container.setAttribute("id", "tutorial_bar_container");
        bubble_container.style.margin = "1rem 0 1rem 0";
        bubble_container.style.display = "none";
        bubble_container.style.pointerEvents = "none";

        bubble.setAttribute("id", "tutorial_bar");
        bubble_text.setAttribute("id", "tutorial_bar_text");
        bubble_text.innerHTML = "";
        bubble.style.fontFamily = "sans-serif";
        bubble.style.fontSize = "1rem";
        bubble.style.backgroundColor = "white";
        bubble.style.fontStyle = "italic";
        bubble.style.padding = "0.5rem";
        bubble.style.paddingLeft = "1rem";
        bubble.style.borderLeft = "0.5rem solid";
        bubble.style.borderLeftColor = "#03a9f4";

        bubble.appendChild(bubble_text);
        bubble_container.appendChild(bubble);
        document.body.appendChild(bubble_container);

        document.getElementsByClassName("ode-DeckPanel")[0].insertBefore(bubble_container, document.getElementsByClassName("ode-DeckPanel")[0].firstChild);

        var df = document.createElement("df-messenger");
        df.setAttribute("intent", "WELCOME");
        df.setAttribute("chat-title", "NAVI Assistant");
        df.setAttribute("agent-id", "XXXXXXXXXX");
        df.setAttribute("language-code", lang);
        df.setAttribute("chat-icon", icon);
        document.body.appendChild(df);

        $('#tutorial_bar_text').fadeOut();

    } catch (error) {

        console.warn(error);

    }

    $r1 = document.querySelector("df-messenger");
    $r2 = $r1.shadowRoot.querySelector("#widgetIcon");

    $r2.onclick = function () {

        openHideTutorialBar();

    };

    $("df-messenger").on("df-request-sent df-response-received df-messenger-loaded",
        function (e) {

            var register = new Register();
            var element = new Element();
            var user = new User();
            var data = [];

            user.mail = window.userName;
            register.user = user;
            register.project = window.projectName;
            register.screen = window.screenName;

            register.workspace = window.workspace;
            register.timeStamp = Date.now();
            register.url = window.location.hostname;
            register.formJson = window.ReplState.phoneState.formJson;

            var xmlStr = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
            register.blocksXml = xmlStr;


            switch (e.type) {

                case "df-messenger-loaded":


                    $r1 = document.querySelector("df-messenger");
                    $r2 = $r1.shadowRoot.querySelector("df-messenger-chat");
                    $r3 = $r2.shadowRoot.querySelector("df-messenger-user-input"); //for other mods

                    var sheet = new CSSStyleSheet();
                    sheet.replaceSync(`div.chat-wrapper[opened="true"] { max-height: 75%;}`);
                    $r2.shadowRoot.adoptedStyleSheets = [sheet];

                    break;

                case "df-request-sent":


                    register.action = "dfRequestSent";

                    element.type = elementTypes.DIALOGFLOW;

                    if (typeof (e.originalEvent.detail.requestBody.queryInput.text) != 'undefined') {
                        data.push(new ElementData("queryText", e.originalEvent.detail.requestBody.queryInput.text.text));
                        data.push(new ElementData("languageCode", e.originalEvent.detail.requestBody.queryInput.text.languageCode));
                    }
                    data.push(new ElementData("target", e.originalEvent.target.localName));

                    element.data = data;
                    break;

                case "df-response-received":


                    register.action = "dfReponseReceived";

                    element.type = elementTypes.DIALOGFLOW;

                    data.push(new ElementData("target", e.originalEvent.target.localName));

                    if (typeof (e.originalEvent.detail.response.queryResult.action) != 'undefined') {
                        data.push(new ElementData("action", e.originalEvent.detail.response.queryResult.action));
                    }


                    if (typeof (e.originalEvent.detail.response.queryResult.allRequiredParamsPresent) != 'undefined') {
                        data.push(new ElementData("allRequiredParamsPresent", e.originalEvent.detail.response.queryResult.allRequiredParamsPresent));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.intent.displayName) != 'undefined') {
                        data.push(new ElementData("intentName", e.originalEvent.detail.response.queryResult.intent.displayName));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.intent.name) != 'undefined') {
                        data.push(new ElementData("intentId", e.originalEvent.detail.response.queryResult.intent.name));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.intentDetectionConfidence) != 'undefined') {
                        data.push(new ElementData("intentDetectionConfidence", e.originalEvent.detail.response.queryResult.intentDetectionConfidence));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.languageCode) != 'undefined') {
                        data.push(new ElementData("languageCode", e.originalEvent.detail.response.queryResult.languageCode));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.queryText) != 'undefined') {
                        data.push(new ElementData("queryText", e.originalEvent.detail.response.queryResult.queryText));
                    }

                    if (typeof (e.originalEvent.detail.response.responseId) != 'undefined') {
                        data.push(new ElementData("responseId", e.originalEvent.detail.response.responseId));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.parameters) != 'undefined') {
                        data.push(new ElementData("parameters", e.originalEvent.detail.response.queryResult.parameters));
                    }
                    if (typeof (e.originalEvent.detail.response.queryResult.fulfillmentText) != 'undefined') {
                        data.push(new ElementData("fulfillmentText", e.originalEvent.detail.response.queryResult.fulfillmentText));
                    }
                    if (typeof (e.originalEvent.detail.response.queryResult.outputContexts) != 'undefined') {

                        data.push(new ElementData("outputContexts", e.originalEvent.detail.response.queryResult.outputContexts));
                    }

                    if (typeof (e.originalEvent.detail.response.queryResult.sentimentAnalysisResult) != 'undefined') {


                        data.push(new ElementData("sentimentAnalysisResult", e.originalEvent.detail.response.queryResult.sentimentAnalysisResult.queryTextSentiment.score));
                    }


                    element.data = data;

                    switch (e.originalEvent.detail.response.queryResult.action) {
                        case "WANT_EVALUATION":
                            register.require_evaluation = true;
                            break;
                        case "STOP_AUTOMATIC_EVALUATIONS":

                            window.postMessage({ type: "CHANGE_AUTOMATIC_EVALUATION", automatic_evaluation: false }, "*");

                            break;
                        case "START_AUTOMATIC_EVALUATIONS":

                            window.postMessage({ type: "CHANGE_AUTOMATIC_EVALUATION", automatic_evaluation: true }, "*");

                            break;
                        case "START_PROJECT_GUIDED":

                            register.action = "guidedProjectStarted";

                            if (e.originalEvent.detail.response.queryResult.parameters.project != "") {

                                window.postMessage({ type: "CHANGE_PROJECT_GUIDED", project_guided_name: e.originalEvent.detail.response.queryResult.parameters.project }, "*");

                                pg_active = true;
                            }

                            break;

                        case "STOP_PROJECT_GUIDED":

                            register.action = "guidedProjectStoped";

                            window.postMessage({ type: "CHANGE_PROJECT_GUIDED", project_guided_name: "none" }, "*");
                            pg_active = false;

                            break;

                        case "CHANGE_LANGUAGE":

                            if (e.originalEvent.detail.response.queryResult.parameters.language == "es" || e.originalEvent.detail.response.queryResult.parameters.language == "en") {

                                window.postMessage({ type: "RELOAD_CHATBOT", lang: e.originalEvent.detail.response.queryResult.parameters.language }, "*");
                            }



                            break;

                        default:
                            break;
                    }


                    break;

            }


            register.element = element;

            window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");


        });


    $("df-messenger").on("keypress", function (e) {

        e.stopImmediatePropagation();
        return;

    });

    $("df-messenger").on("df-messenger-loaded", function (e) {

    });


}

function showServerResponse() {

    function getColorHexaCode(message) {
        const regex = /[^'"\\]*(?:\\.[^'"\\]*)*(["'])([^"'\\]*(?:(?:(?!\1)["']|\\.)[^"'\\]*)*)\1/gy,
              texto = message;
        var   grupo,
              resultado = [];
        
        while ((grupo = regex.exec(texto)) !== null) {
            resultado.push(grupo[2]);
        }
    
        return resultado[resultado.length-1];
        
    }

    var guided_tip = "";

    window.addEventListener("message", function (event) {

        if (event.source != window)
            return;
        if (event.data.type && (event.data.type == "DIALOG_MESSAGE")) {

            const dfMessenger = document.querySelector('df-messenger');

            if (event.data.msg.type == "evaluation") {

                const payload = JSON.parse(event.data.msg.data);
                dfMessenger.renderCustomCard(payload);

            } else if (event.data.msg.type == "tutorial") {


                dfMessenger.renderCustomText(event.data.msg.data);

                animateTutorialBar();

                if(event.data.msg.data.includes("#")){

                    var color_hex=getColorHexaCode(event.data.msg.data);
                    bubble_text.innerHTML=event.data.msg.data.replace(`"${color_hex}"`,"");
                    color_box.style.backgroundColor=color_hex;
                    color_box.style.paddingLeft="1rem";
                    color_box.style.marginLeft="0.5rem";
                    color_box.style.border="0.1rem solid black";
                    bubble_text.appendChild(color_box);

                }else{

                    bubble_text.innerHTML = event.data.msg.data;
                }
                

            } else if (event.data.msg.type == "tutorial_time") {

                dfMessenger.renderCustomText(event.data.msg.data);


            } else if (event.data.msg.type == "tutorial_end") {

                bubble_container.style.display = "none";
                bubble_text.innerHTML = "";
                dfMessenger.setAttribute('expand', '');
                const payload = JSON.parse(event.data.msg.data);
                dfMessenger.renderCustomCard(payload);
                var register = new Register();
                var element = new Element();
                var user = new User();
                var data = [];

                user.mail = window.userName;
                register.user = user;
                register.project = window.projectName;
                register.screen = window.screenName;

                register.workspace = window.workspace;
                register.timeStamp = Date.now();
                register.url = window.location.hostname;
                register.formJson = window.ReplState.phoneState.formJson;

                var xmlStr = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
                register.blocksXml = xmlStr;
                register.action = "guidedProjectEnded";
                data.push(new ElementData("payload", payload));
                element.type = elementTypes.DIALOGFLOW;
                element.data = data;
                register.element = element;

                window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");


            }


        }

    });
}
