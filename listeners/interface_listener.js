
function getClassElement(element) {


    if ((typeof ($(element).attr("class")) == 'undefined')) {


        return false;

    } else {

        return $(element).attr("class");

    }


}

$(document).on("blur focus focusin focusout load resize unload click " +
    "dblclick mousedown mouseup create drag dragenter mouseover" +
    "change select submit keydown keypress keyup error message ",
    function (e) {

        switch (e.type) {
            

            case "click":
                var register = new Register();
                var element = new Element();
                var user = new User();

                if ($(e.target).prop("tagName") != "DF-MESSENGER") {

                    $r1 = document.querySelector("df-messenger");
                    $r1.removeAttribute("expand");
                    window.postMessage({ type: "CLOSE_CHATBOT" }, "*");

                }

                if (typeof (e.target.innerText) != 'undefined') {

                    if ((e.target instanceof HTMLTableCellElement) == false) {

                        if ((e.target instanceof HTMLTableElement) == false) {

                            if (e.target.innerText.split(/\r\n|\r|\n/).length == 1) {

                                if ($(e.target).attr("class") != "injectionDiv") {


                                    if ((typeof ($(e.target).attr("class")) == 'undefined') || (!$(e.target).attr("class").includes("ode-Box-body"))) {


                                        if ($(e.target).prop("tagName") != "DF-MESSENGER") {

                                            var data = [];
                                            element.type = elementTypes.UI;
                                            user.mail = window.userName;
                                            register.user = user;
                                            register.project = window.projectName;
                                            register.screen = window.screenName;
                                            register.action = e.type + "OnElement";
                                            register.timeStamp = Date.now();
                                            //register.workspace=window.workspace;
                                            register.url = window.location.hostname;
                                            register.formJson = window.ReplState.phoneState.formJson;

                                            var xmlStr = new XMLSerializer().serializeToString(window.Blockly.Xml.workspaceToDom(Blockly.mainWorkspace, false));
                                            register.blocksXml = xmlStr;

                                            data.push(new ElementData("target", e.target.localName));

                                            if (getClassElement(e.target) != false) { data.push(new ElementData("class", getClassElement(e.target))); }

                                            if (e.target.innerText != "") {

                                                data.push(new ElementData("value", e.target.innerText.replace("▾", "").trim()));
                                            } else {
                                                //element.value = e.target.value;
                                                data.push(new ElementData("value", e.target.value.replace("▾", "").trim()));
                                            }



                                            element.data = data;

                                            try {
                                                
                                                if (element.data[0].value == "div" && element.data[1].value == "html-face" && element.data[2].value == "Blocks" || element.data[2].value == "Bloques") {

                                                    register.workspace = "Blocks";
                                                }
                                                else if (element.data[0].value == "div" && element.data[1].value == "html-face" && element.data[2].value == "Designer" || element.data[2].value == "Diseñador") {
    
                                                    register.workspace = "Designer";
    
                                                } else {
    
                                                    register.workspace = window.workspace;
                                                }

                                            } catch (error) {


                                                console.warn(error);

                                                register.workspace = window.workspace;
                                                
                                            }
                                           


                                            register.element = element;


                                            window.postMessage({ type: "INTERACTION_LOG", register: register }, "*");
                                        }


                                    }

                                }

                            }

                        }


                    }

                }

                break;


        }


    });