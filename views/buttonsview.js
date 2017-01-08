var jade = require("jade");
var $ = require("jquery");
require("sugar");

module.exports = function ButtonsView(containerID) {
    var message = jade.compileFile("templates/connectionMsg.jade", {pretty: true, filename: "templates/connectionMsg.jade"});
    $(containerID).hide();

    // display a notification
    // args : locals : flags to select the message. One of OK, ERROR or WAIT have to be true
    //        hide : whether to message auto hide or not
    function showMessage(locals, hide) {
        $(containerID).html(message(locals));
        $(containerID).removeClass("bounceOutLeft").show().addClass("bounceInLeft");
        if(hide) {
            (function() {$(containerID).addClass("bounceOutLeft");}).delay(3000);
        }
    }

    function showOK() {
        showMessage({OK: true}, true);
    }
    function showWait() {
        showMessage({WAIT: true}, false);
    }
    function showError() {
        showMessage({ERROR: true}, true);
    }
    function showTimeout() {
        showMessage({TIMEOUT: true}, true);
    }

    return {OK: showOK, error: showError, wait: showWait, timeout:showTimeout};
};
