var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');

module.exports = function BackOffice(scoreBoard) {
    var app = express();
    // view engine setup
    app.set('views', path.join(__dirname, 'templates'));
    app.set('view engine', 'jade');

    app.use(express.static('public'));
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));

    app.get('/', function (req, res) {
        res.render("backoffice", scoreBoard);
    });

    app.post('/teams/odd/score/:score', function(req, res) {
        scoreBoard.teams().odd.score(req.params.score);
        scoreBoard.updateColor();
        res.send("OK");
    });
    app.post('/teams/even/score/:score', function(req, res) {
        scoreBoard.teams().even.score(req.params.score);
        scoreBoard.updateColor();
        res.send("OK");
    });
    app.post('/happytime/message/', function(req, res) {
        scoreBoard.happyhour.message(req.body.message);
        res.send("OK");
    });
    app.post('/happytime/start/', function(req, res) {
        scoreBoard.happyhour.start(parseInt(req.body.duration), req.body.message);
        res.send("OK");
    });
    app.post('/happytime/stop/', function(req, res) {
        scoreBoard.happyhour.stop();
        res.send("OK");
    });
    app.post('/freedrink/:proba', function(req, res) {
        scoreBoard.freeDrinkProba(parseFloat(req.params.proba.replace("p", ".")));
        res.send("OK");
    });
    app.post('/game/end/:hour', function(req, res) {
        scoreBoard.endTime(req.params.hour);
        res.send("OK");
    });
    app.post('/game/stop/:minutes', function(req, res) {
        scoreBoard.endGame(parseInt(req.params.minutes));
        res.send("OK");
    });

    var server = app.listen(3000, function () {
        console.log("Back-office listening on port " + server.address().port);
    });
}
