class Register {

    constructor() {

        this._require_evaluation = false;
    }
    /**
     * @param {User} value
     */
    set user(value) {

        this._user = value;
    }

    get user() {

        return this._user;
    }
    /**
     * @param {any} value
     */
    set project(value) {

        this._project = value;
    }
    get project() {

        return this._project;
    }

    /**
     * @param {any} value
     */
    set screen(value) {

        this._screen = value;
    }
    get screen() {

        return this._screen;
    }
    /**
     * @param {string} value
     */
    set action(value) {

        this._action = value;
    }
    get action() {

        return this._action;
    }
    /**
     * @param {string} value
     */
    set workspace(value) {
        this._workspace = value;
    }
    get workspace() {

        return this._workspace;
    }
    /**
     * @param {number} value
     */
    set timeStamp(value) {

        this._timeStamp = value;
    }
    get timeStamp() {

        return this._timeStamp;
    }
    /**
     * @param {string} value
     */
    set url(value) {

        this._url = value;
    }
    get url() {

        return this._url;
    }
    /**
     * @param {Element} value
     */
    set element(value) {

        this._element = value;
    }
    get element() {

        return this._element;
    }
    /**
     * @param {any} value
     */
    set formJson(value) {

        this._formJson = value;
    }
    get formJson() {

        return this._formJson;
    }

    /**
     * @param {string} value
     */
    set blocksXml(value) {

        this._blocksXml = value;
    }
    get blocksXml() {

        return this._blocksXml;
    }
    /**
     * @param {boolean} value
     */
    set require_evaluation(value) {

        this._require_evaluation = value;
    }
    get require_evaluation() {

        return this._require_evaluation;
    }

    /**
     * @param {any} value
     */
    set project_guided(value) {

        this._project_guided = value;
    }

    get project_guided() {

        return this._project_guided;
    }





}


class User {

    /**
     * @param {any} value
     */
    set mail(value) {

        this._mail = value;
    }

    get mail() {

        return this._mail;
    }
    /**
     * @param {any} value
     */
    set age(value) {

        this._age = value;
    }
    get age() {

        return this._age;
    }
    /**
     * @param {any} value
     */
    set gender(value) {

        this._gender = value;
    }
    get gender() {

        return this._gender;
    }
    /**
     * @param {any} value
     */
    set education(value) {

        this._education = value;
    }
    get education() {

        return this._education;
    }
    /**
     * @param {any} value
     */
    set experience(value) {

        this._experience = value;
    }

    get experience() {

        return this._experience;
    }
    set lang(value) {

        this._lang = value;
    }

    get lang() {

        return this._lang;
    }

}
class Element {
    /**
     * @param {any} value
     */
    set type(value) {

        this._type = value;
    }
    get type() {

        return this._type;
    }
    /**
     * @param {any} value
     */
    set data(value) {

        this._data = value;
    }
    get data() {

        return this._data;
    }
}

class ElementData {
    /**
     * @param {any} value
     */
    set key(value) {

        this._key = value;
    }
    get key() {

        return this._key;
    }
    /**
     * @param {any} val
     */
    set value(val) {

        this._value = val;
    }
    get value() {

        return this._value;
    }
    constructor(key, value) {

        this._key = key;

        if (typeof (value) == "object") {
            this._value = JSON.stringify(value);
        } else {

            this._value = value;
        }

    }
}
const elementTypes = {
    DIALOGFLOW: 'dialogflow',
    COMPONENT: 'component',
    BLOCK: 'block',
    UI: 'ui'
};

class FaceExpression {
    /**
     * @param {any} value
     */
    set expression(value) {

        this._expression = value;
    }
    get expression() {

        return this._expression;
    }
    /**
     * @param {any} value
     */
    set percent(value) {

        this._percent = value;
    }
    get percent() {

        return this._percent;
    }
    /**
    * @param {any} value
    */
    set avg_detection(value) {

        this._avg_detection = value;
    }
    get avg_detection() {

        return this._avg_detection;
    }
    constructor(expression, percent, avg_detection) {

        this._expression=expression;
        this._percent=percent;
        this._avg_detection=avg_detection;

    }
}
