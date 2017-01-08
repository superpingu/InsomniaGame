var jade = require("jade");
var fs = require("fs");
var $ = require("jquery");

/*
 * handles graphical interface to connect to serial port
 *  args : containerDiv : a jQuery object pointing to a div that will contain the port selector
 */
module.exports = function SerialView(containerDiv, gui) {
    // jade template
    //noinspection JSCheckFunctionSignatures
    var connectTemplate = jade.compileFile('templates/portlist.jade', {pretty: true, filename: "templates/serialSelect.jade"});

    var lastValues = require("./../lastConnection.json");      // reload last port value
    var connectCallback;

    // set up shortcut:
    var showHide = new gui.Shortcut({key:"Ctrl+P"});
    showHide.on('active', function() {
        $(containerDiv).toggleClass("slideInDown").toggleClass("slideOutUp");
    });
    gui.App.registerGlobalHotKey(showHide);

    function renderView(portlist) {
        var displayInfo = {list : portlist, portname: lastValues.portname, baudrate: lastValues.baudrate};
        $(containerDiv).html(connectTemplate(displayInfo))
                       .find("#serial-connect").click(connectSerial);
    }
    function connectSerial() {
        var port = $(containerDiv).find("#portselect").val();
        var baudrate = $(containerDiv).find("#baud").val();
        saveValues(port, baudrate);
        connectCallback(port, baudrate);
    }
    function saveValues(port, baudrate) {
        fs.writeFile( "./lastConnection.json", JSON.stringify({portname:port, baudrate: baudrate}), "utf8");
    }
    function onConnect(callback) {
        connectCallback = callback;
    }

    return {connect: onConnect, render: renderView};
};
