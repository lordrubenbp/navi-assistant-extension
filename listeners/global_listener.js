
var islistenersInjected = false;
var injectedBlockListenerScript = false;
window.workspace = "Designer";

function getWorkspace() {

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

                    newWorkspace = value.textContent;

                } else if (value.textContent.includes("Blocks")) {

                    newWorkspace = value.textContent;
                }

            });

        }



        if (newWorkspace == "Blocks" && window.workspace == "Designer") {

            if (injectedBlockListenerScript == false) {

                var data = { type: "INJECT_BLOCK_LISTENER" };
                window.postMessage(data, "*");
                injectedBlockListenerScript = true;
            } else {

    
                window.dispatchEvent(new CustomEvent('reload'));

            }

        }

        window.workspace = newWorkspace;

    } catch (error) {


        console.warn(error);

    }




}


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



    } catch (error) {

        console.warn(error);

    }



}

function isProjectLoaded() {


    try {
        if (Blockly.mainWorkspace != null) {

            return true;
        }
    } catch (error) {

        console.warn("Wait to Blockly variable...");
    }

}


function initListeners() {

    if (islistenersInjected == false) {


        window.postMessage({ type: "INJECT_DIALOGFLOW" }, "*");
        window.postMessage({ type: "INJECT_UI_LISTENER" }, "*");
        window.postMessage({ type: "INJECT_COMPONENT_LISTENER" }, "*");


        islistenersInjected = true;
    }

}
setInterval(function () {

    if (isProjectLoaded()) {

        initListeners();
        getWorkspace();
        getProjectData();

    }

}, 300);
