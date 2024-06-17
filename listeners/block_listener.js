//TODO Blockly.Xml.workspaceToDom(Blockly.mainWorkspace,false) esta sentencia me devuelve el xml del workspace

//Esta funcion carga o recarga la subscripcion a los eventos de los bloques que proporciona el propio Blocky
function reloadBlocklyListeners() {

    console.debug("Cargando listener de bloques...");

    Object.entries(Blockly.allWorkspaces).forEach(function (name) {

        Blockly.Workspace.getById(name[1].id).removeChangeListener(onBlocklyChanged);
    });
    //mira todos los workspaces disponibles y le añade el listener

    Object.entries(Blockly.allWorkspaces).forEach(function (name) {


        Blockly.Workspace.getById(name[1].id).addChangeListener(onBlocklyChanged);
    });

}

function onBlocklyChanged(event) {
    var evento = new CustomEvent('blockly', { 'detail': event });

    window.dispatchEvent(evento);

}


function getBlockType(block_color) {


    switch (block_color) {

        case Blockly.CONTROL_CATEGORY_HUE:

            return "control";


        case Blockly.LOGIC_CATEGORY_HUE:

            return "logic";


        case Blockly.MATH_CATEGORY_HUE:

            return "math";

        case Blockly.TEXT_CATEGORY_HUE:

            return "text";


        case Blockly.LIST_CATEGORY_HUE:

            return "list";


        case Blockly.COLOR_CATEGORY_HUE:

            return "color";


        case Blockly.VARIABLE_CATEGORY_HUE:

            return "variable";

        case Blockly.PROCEDURE_CATEGORY_HUE:

            return "procedure";


        case Blockly.DICTIONARY_CATEGORY_HUE:

            return "dictionary";


        case "#439970":

            return "variable";


        case "#266643":

            return "variable";


    }

}



reloadBlocklyListeners();



window.addEventListener('reload', function (e) {


    reloadBlocklyListeners();

}, false);
window.addEventListener('blockly', function (e) {



    var register = new Register();
    var element = new Element();
    var user = new User();
    var data = [];

    if (e.detail.workspaceId != null) {

        if (e.detail.blockId != null) {

            if (e.detail.type != "ui") {



                data.push(new ElementData("blockId", e.detail.blockId));
                data.push(new ElementData("workspaceId", e.detail.workspaceId));
                data.push(new ElementData("group", e.detail.group));
                data.push(new ElementData("recordUndo", e.detail.recordUndo));

                switch (e.detail.type) {
                    case "create":

                        break;

                    case "move":
                        if (typeof (e.detail.newCoordinate) != 'undefined') { data.push(new ElementData("newCoordinate", { x: e.detail.newCoordinate.x, y: e.detail.newCoordinate.y })); }
                        if (typeof (e.detail.oldCoordinate) != 'undefined') { data.push(new ElementData("oldCoordinate", { x: e.detail.oldCoordinate.x, y: e.detail.oldCoordinate.y })); }
                        if (typeof (e.detail.newInputName) != 'undefined') { data.push(new ElementData("newInputName", e.detail.newInputName)); }
                        if (typeof (e.detail.newParentId) != 'undefined') { data.push(new ElementData("newParentId", e.detail.newParentId)); }
                        if (typeof (e.detail.oldInputName) != 'undefined') { data.push(new ElementData("oldInputName", e.detail.oldInputName)); }
                        if (typeof (e.detail.oldParentId) != 'undefined') { data.push(new ElementData("oldParentId", e.detail.oldParentId)); }



                        break;
                    case "delete":

                        break;
                    case "change":

                        data.push(new ElementData("element", e.detail.element));
                        data.push(new ElementData("name", e.detail.name));
                        data.push(new ElementData("newValue", e.detail.newValue));
                        data.push(new ElementData("oldValue", e.detail.oldValue));

                        break;
                }


                if (e.detail.type != "delete") {

                    var block_type = "";
                    var block_text = "";
                    if (Blockly.Workspace.getById(e.detail.workspaceId).getBlockById(e.detail.blockId) != null) {

                        block_type = getBlockType(Blockly.Workspace.getById(e.detail.workspaceId).getBlockById(e.detail.blockId).getColour());

                        block_text = Blockly.Workspace.getById(e.detail.workspaceId).getBlockById(e.detail.blockId).toString();

                        last_block_text = block_text;

                        last_block_type = block_type;

                    }
                    if (block_text != "") {

                        data.push(new ElementData("type", block_type));
                        data.push(new ElementData("textValue", block_text));

                        user.mail = window.userName;
                        register.user = user;
                        register.project = window.projectName;
                        register.screen = window.screenName;
                        register.action = e.detail.type + "Block";
                        register.workspace = "Blocks";
                        register.timeStamp = Date.now();
                        register.url = window.location.hostname;
                        register.formJson = window.ReplState.phoneState.formJson;

                        register.blocksXml = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
                        element.type = elementTypes.BLOCK;

                        element.data = data;
                        register.element = element;


                        window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");


                    }


                } else {

                    data.push(new ElementData("type", last_block_type));
                    data.push(new ElementData("textValue", last_block_text));

                    user.mail = window.userName;
                    register.user = user;
                    register.project = window.projectName;
                    register.screen = window.screenName;
                    register.action = e.detail.type + "Block";
                    register.workspace = "Blocks";
                    register.formJson = window.ReplState.phoneState.formJson;

                    register.blocksXml = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
                    register.timeStamp = Date.now();
                    register.url = window.location.hostname;

                    // element.type = last_block_type;
                    //element.value = last_block_text;
                    element.type = elementTypes.BLOCK;
                    element.data = data;
                    register.element = element;



                    window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");
                    //console.log(register);
                }

            }

        }
    } else {
        //console.log("");
    }

}, false);

