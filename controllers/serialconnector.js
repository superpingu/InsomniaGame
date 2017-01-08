var sp = require("serialport");
require("sugar");

module.exports = function SerialConnector(view, window) {
    var port;
    var readCallback = function(line) {console.log(line)}; // default behaviour : output data as it is received
    var openCallback = function() {};

    window.on('close', function () {
        if(port && port.isOpen())
            port.close();
        this.close(true);
    });

    // when click on connect
    view.connect(function(portname, baudrate) {
        if(port)
            port.close();

        port = new sp.SerialPort(portname, {
            baudrate: baudrate,
            parser: sp.parsers.readline("\r\n")
        });
        port.on("open", function() {
            console.log("open serial port");

            port.on('data', onReadLine);

            port.on('error', function (err) {
                openCallback(false);
            });

            openCallback(true);
        });
        openCallback(true);
    });

    function onReadLine(line) {
        console.log("receive : "+line);
        readCallback(line);
    }

    function getPortList(callback)  {
        sp.list(function(err, ports) {
            callback(ports);
        });
    }
    function setReadCallback(callback) {
        readCallback=callback;
    }
    function setOpenCallback(callback) {
        openCallback=callback;
    }
    function writeData(buffer, callback) {
        if(port && port.isOpen()) {
            buffer += "\r\n"
            console.log("send : " + buffer);
            port.write(buffer, callback);
        }
    }

    return {
        portList: getPortList,
        readLine: setReadCallback,
        opened: setOpenCallback,
        write: writeData
    };
};