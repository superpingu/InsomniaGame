// main libs
var $ = require('jquery');
var gui = require('nw.gui');

var SerialConnector = require("./controllers/serialconnector");
var SerialView = require("./views/serialview.js");
var BarButtons = require("./controllers/barbuttons.js");
var ButtonsView = require("./views/buttonsview.js");
var ScoreBoard = require("./controllers/scoreboard.js");
var ScoreView = require("./views/scoreview.js");
var Team = require("./controllers/team.js");
var TeamView = require("./views/teamview.js");
var BackOffice = require("./backoffice.js");

// create the serial port connection and associated view
var serialview = SerialView("#port-container", gui);
var connector = SerialConnector(serialview, gui.Window.get());


// when document is ready
$(function(){
    // create hardware driver and view
    var buttonsView = ButtonsView("#connection-notif");
    var buttons = BarButtons(connector, buttonsView);

    // get all available serial ports and render the select serial port view
    connector.portList(function (list) {
       serialview.render(list);
    });

    // create two teams
    var oddTeamView= TeamView("#odd-team");
    var oddTeam = Team("Equipe Bleu", oddTeamView);
    var evenTeamView= TeamView("#even-team");
    var evenTeam = Team("Equipe Rouge", evenTeamView);

    // create the score board to contain them
    var scoreView = ScoreView("#score-board-container");
    var scores = ScoreBoard(buttons, oddTeam, evenTeam, scoreView);
    var backOffice = BackOffice(scores);

    scores.render();
});