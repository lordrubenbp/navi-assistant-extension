
var old_components = [];

function getScreenComponents() {

    try {

        var new_components = [];

        Object.entries(window.Blockly.mainWorkspace.componentDb_.instances_).forEach(component => {

            var properties = [];

            JSON.parse(BlocklyPanel_getComponentInfo(component[1].typeName)).properties.forEach(property => {

                properties.push({

                    name: property.name,
                    value: BlocklyPanel_getComponentInstancePropertyValue(Blockly.mainWorkspace.formName, component[1].name, property.name)

                });

            });


            new_components.push({
                id: component.toString().split(",", 1)[0],
                name: component[1].name,
                type: component[1].typeName,
                properties: properties

            });


        });


        if (old_components.length >= 1) {

            checkComponentsChanges(new_components, old_components);

        }

        old_components = new_components;

    } catch (error) {

        console.warn(error);

    }


}

function checkComponentsChanges(new_components, old_components) {

    var register = new Register();
    var element = new Element();
    var user = new User();
    var action;
    var hasResults = false;
    var data = [];

    if (new_components[0].name == old_components[0].name) {

        var found;
        if (new_components.length > old_components.length) {

            action = "createComponent";

            found = false;
            for (i = 0; i < new_components.length; i++) {

                for (y = 0; y < old_components.length; y++) {

                    if (new_components[i].id == old_components[y].id) {
                        found = true;
                    }
                }
                if (found == false) {
                    //component = new_components[i].name;
                    //type = new_components[i].type;

                    data.push(new ElementData("type", new_components[i].type));
                    data.push(new ElementData("name", new_components[i].name));
                    //console.log("CREADO: " + component);
                    hasResults = true;
                    break;
                } else {
                    found = false;
                }
            }

        } else if (new_components.length < old_components.length) {

            action = "deleteComponent";

            found = false;
            for (i = 0; i < old_components.length; i++) {

                for (y = 0; y < new_components.length; y++) {

                    if (new_components[y].id == old_components[i].id) {
                        found = true;
                    }
                }
                if (found == false) {

                    //component = old_components[i].name;
                    //type = old_components[i].type;
                    data.push(new ElementData("type", old_components[i].type));
                    data.push(new ElementData("name", old_components[i].name));
                    //console.log("BORRADO: " + component);
                    hasResults = true;
                    break;
                } else {
                    found = false;
                }
            }

        } else {

            for (i = 0; i < old_components.length; i++) {

                for (y = 0; y < new_components.length; y++) {

                    if ((new_components[y].id == old_components[i].id) && (new_components[y].name != old_components[i].name)) {

                        action = "changeComponentName";
                        //component = new_components[y].name;
                        //type = new_components[y].type;

                        data.push(new ElementData("type", new_components[y].type));
                        data.push(new ElementData("name", new_components[y].name));

                        //console.log("CAMBIADO: " + component);
                        hasResults = true;
                        break;
                    }
                }
            }

            if (!hasResults) {


                for (i = 0; i < old_components.length; i++) {

                    for (y = 0; y < new_components.length; y++) {

                        if ((new_components[y].id == old_components[i].id)) {

                            action = "changeComponentProperty";

                            for (x = 0; x < new_components[y].properties.length; x++) {


                                if (new_components[y].properties[x].value != old_components[i].properties[x].value) {

                                    //type = new_components[y].name + "-" + new_components[y].properties[x].name;
                                    //component = new_components[y].properties[x].value;

                                    data.push(new ElementData("type", new_components[y].type));
                                    data.push(new ElementData("name", new_components[y].name));

                                    data.push(new ElementData("property", new_components[y].properties[x].name));
                                    data.push(new ElementData("newValue", new_components[y].properties[x].value));

                                    //console.log("CAMBIADO: " + component);
                                    hasResults = true;
                                    break;

                                }

                            }



                        }
                    }
                }



            }


        }

    } else {

        action = "changeScreen";
        //component = new_components[0].name;
        //type = new_components[0].type;

        data.push(new ElementData("type", new_components[0].type));
        data.push(new ElementData("name", new_components[0].name));
        hasResults = true;
    }

    if (hasResults) {

        user.mail = window.userName;
        register.user = user;
        register.project = window.projectName;
        register.screen = window.screenName;
        register.action = action;
        register.workspace = workspace;
        register.timeStamp = Date.now();
        register.url = window.location.hostname;

        register.formJson = window.ReplState.phoneState.formJson;

        var xmlStr = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
        register.blocksXml = xmlStr;

        element.type = elementTypes.COMPONENT;
        element.data = data;
        register.element = element;

        window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");
    }


}


setInterval(function () {

    getScreenComponents();

}, 100);
