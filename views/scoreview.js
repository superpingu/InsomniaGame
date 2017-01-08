var jade = require("jade");
var $ = require("jquery");

module.exports = function ScoreView(containerID) {
    var layout = jade.compileFile("templates/scoreLayout.jade", {pretty: true, filename:"scoreLayout.jade"});

    function renderView(locals) {
        $(containerID).html(layout(locals))
    }

    return {
        render: renderView
    }
};
