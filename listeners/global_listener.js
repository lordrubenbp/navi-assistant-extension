
var islistenersInjected = false;
var injectedBlockListenerScript = false;
window.workspace = "Designer";



//Esta funcion me dice el espacio de trabajo donde esta el usuario
function getWorkspace() {

    //Dependiendo de la version de AI2 podre verlo directamente con la funcion HTML5DragDrop_isBlocksEditorOpen(), o tendre que deducirlo
    try {

        var newWorkspace;

        if (typeof HTML5DragDrop_isBlocksEditorOpen === "function") {

            if (HTML5DragDrop_isBlocksEditorOpen()) {
                newWorkspace = "Blocks";
            } else {
                newWorkspace = "Designer";
            }


        } else {

            $.each($(".ode-TextButton-up-disabled"), function (index, value) {
                if (value.textContent.includes("Designer")) {

                    //console.log(value.textContent);
                    newWorkspace = value.textContent;
                    //window.workspace="Designer";

                } else if (value.textContent.includes("Blocks")) {

                    //console.log(value.textContent);
                    newWorkspace = value.textContent;
                }

            });

        }



        //Cuando cambie el usuario al espacio de bloques...pido que se injecte el listener de bloques
        if (newWorkspace == "Blocks" && window.workspace == "Designer") {

            if (injectedBlockListenerScript == false) {

                var data = { type: "INJECT_BLOCK_LISTENER" };
                window.postMessage(data, "*");
                injectedBlockListenerScript = true;
            } else {

                //CUANDO ya he creado por primera vez el script
                //las siguientes veces injecto esta llamada para que borre y vuelva a pillar todos los listener
                //esto es necesario por si creo una nueva pantalla


                window.dispatchEvent(new CustomEvent('reload'));

            }

        }

        //console.log(window.workspace);
        window.workspace = newWorkspace;

    } catch (error) {


        console.warn(error);

    }




}


//Esta funcion recopila el nombre de usuario, nombre de pantalla y nombre de proyecto, leyendo la interfaz de la pantalla
function getProjectData() {



    try {

        $.each($(".html-face"), function (index, value) {
            if (value.textContent.includes("@")) {

                window.userName = value.textContent.replace("▾", "").trim();

                return false;

            }

        });


        window.screenName = window.ReplState.phoneState.packageName.split(".")[3];

        window.projectName = window.ReplState.phoneState.packageName.split(".")[2];

        // window.screenName = Blockly.mainWorkspace.formName.split("_")[1];
        // window.projectName = Blockly.mainWorkspace.projectId;


    } catch (error) {

        console.warn(error);

    }



}

//Esta funcion comprueba que la variable Blocky de AI2 se ha cargado
function isProjectLoaded() {


    try {
        if (Blockly.mainWorkspace != null) {

            return true;
        }
    } catch (error) {

        console.warn("Wait to Blockly variable...");
    }

}


//Esta funcion manda los mensajes correspondientes a content.js para que injecte los listener 
function initListeners() {

    if (islistenersInjected == false) {


        window.postMessage({ type: "INJECT_DIALOGFLOW" }, "*");
        window.postMessage({ type: "INJECT_UI_LISTENER" }, "*");
        window.postMessage({ type: "INJECT_COMPONENT_LISTENER" }, "*");


        islistenersInjected = true;
    }

}
//Cada un determinado rango de tiempo se comprueba que los listener estan injectados, el espacio de trabajo y los datos basicos del proyecto
setInterval(function () {

    if (isProjectLoaded()) {

        initListeners();
        getWorkspace();
        getProjectData();

    }

}, 300);
