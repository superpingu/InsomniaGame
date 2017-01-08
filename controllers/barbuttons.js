require("sugar");

/*
 * Hardware driver : provides abstraction over arduino's serial messages
 */
module.exports = function BarButtons(port, view) {
    var hardwareTokens = require("./../tokens.json");
    var scoreCallback = function() {console.log("a button was pressed")};

    // on port opening, do a handshake to make sure arduino is working
    port.opened(function (success) {
        if(success) {        // if port successfully opened
            view.wait();
            port.write.delay(2000,hardwareTokens.handshakeRequest+"\n");                     // send handshake message
            port.readLine(readHandshake);                     // and wait for answer
            view.timeout.delay(3000);                         // display error if no answer within 1 second
        } else {
            view.error();
        }
    });

    function readHandshake(line) {
        console.log(line);
        if(line===hardwareTokens.handshakeAnswer) { // show handshake OK
            view.timeout.cancel();  // stop timeout daemon
            view.OK();
            port.readLine(readButtons); // change listener
        }
    }
    function readButtons(line) {
        if(Object.has(hardwareTokens.teams, line)) // if team exists (name is in the teams array)
            scoreCallback(hardwareTokens.teams[line]);
    }
    function setScoreCallback(callback) {
        scoreCallback = callback;
    }

    function safeSend(str) {
        if(port) {
            port.write(str);
        } else {
            console.error("Can't send anything while port is closed !");
        }
    }
    function sendColor(ratio) {
        var str = ratio + "";
        for(var i=str.length;i<3;i++)
            str = "0"+str;
        safeSend(hardwareTokens.colors+str);
    }
    function startHappyTime() {
        safeSend(hardwareTokens.happytime)
    }
    function stopHappyTime() {
        safeSend(hardwareTokens.happytimeend)
    }
    function showSoloTeam(team) {
        safeSend(hardwareTokens.solo + team.command);
    }
    function flashLights() {
        safeSend(hardwareTokens.flash);
    }

    return {
        color : sendColor,
        solo : showSoloTeam,
        happyTime : {
            start: startHappyTime,
            stop: stopHappyTime
        },
        flash: flashLights,
        addScore: setScoreCallback
    }
};