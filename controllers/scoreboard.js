var CountDown = require("./countdown.js");
var CountDownView = require("./../views/countdownview.js");
var fs = require("fs");

module.exports = function ScoreBoard(driver, oddTeam, evenTeam, view) {
    var config = require("./../config.json");

    var teams = {odd: oddTeam, even: evenTeam};
    var happyHour = false;
    var countDown = CountDown(CountDownView("#countdown"));
    var finalCountDown = CountDown(CountDownView("#final-countdown"));
    var gameEnd = Date.future(config.endTime);
    var endCountdown = false;

    // ##### event bindings #####
    countDown.end(function() {  // happy hour end
        stopHappyHour();
    });

    driver.addScore(function(button) { // each time a drink is served
        if(Math.random()*100 < config.freeDrink) {
            driver.solo(button);
            console.log(button.team);
            teams[button.team].addPoints(config.BONUS_DRINK);
            teams[button.team].freeDrink(true);
        } else {
            teams[button.team].addPoints(config.NORMAL_DRINK);
        }
        updateColor();
    });

    (function() {
        if(gameEnd.isBefore("now")) // if we reached game end
            endGame();
    }).every(10000);

    function updateColor() {
        // lights hue matching winning team
        var hue = (teams.even.score() - teams.odd.score())*2/(teams.odd.score() + teams.even.score())*60 + 50;
        hue = hue > 100 ? 100 : hue; hue = hue < 0 ? 0 : hue; // clip values higher than 100 and lower than 0
        driver.color(Math.floor(hue));
    }
    function endGame(minutes) {
        endCountdown = true;
        if(minutes) {
            finalCountDown.start(minutes);
            render();
            finalCountDown.end(onEnd);
        } else
            onEnd();

        function onEnd() {
            var winner = teams.odd.score() > teams.even.score() ? "odd" : "even";
            happyHour = false;
            endCountdown = false;
            render();
            teams.odd.win(winner == "odd");
            teams.even.win(winner == "even");
            driver.color(winner == "odd" ? 100 : 0);
            driver.addScore(function() {console.log("C'est fini !")}); // disable buttons
        }
    }
    function render() {
        view.render({happyHour: happyHour, message: config.happyMessage, endCountdown: endCountdown});
        oddTeam.render();
        evenTeam.render();
    }
    function startHappyHour(minutes, message) {
        countDown.start(minutes);

        config.happyTime = minutes;
        config.happyMessage = message;
        saveConfigChanges();

        happyHour = true;
        driver.happyTime.start();
        render();
    }
    function stopHappyHour() {
        happyHour = false;
        driver.happyTime.stop();
        countDown.stop();
        countDown.hide();
        render();
    }
    function setEndGameTime(time) {
        config.endTime = time;
        saveConfigChanges();
        gameEnd = Date.future(time);
    }
    function setFreeDrinkProba(proba) {
        config.freeDrink = proba;
        saveConfigChanges();
    }
    function saveConfigChanges() {
        fs.writeFile( "./config.json", JSON.stringify(config), "utf8");
    }
    function  setHappyTimeMessage(message) {
        config.happyMessage = message;
        saveConfigChanges();
        render();
    }

    return {
        render: render,
        happyhour: {
            start : startHappyHour,
            stop : stopHappyHour,
            message : setHappyTimeMessage
        },
        teams: function() {return teams},
        endGame : endGame,
        endTime : setEndGameTime,
        freeDrinkProba: setFreeDrinkProba,
        config : function() {return config},
        updateColor : updateColor
    };
};