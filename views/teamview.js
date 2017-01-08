var jade = require("jade");
var $ = require("jquery");

module.exports = function TeamView(containerID) {
    var layout = jade.compileFile("templates/teamLayout.jade", {pretty: true, filename:"teamLayout.jade"});

    function renderView(locals) {
        $(containerID).html(layout(locals));
    }
    function showFreeDrink(visible) {
        if(visible) {
            $(containerID + " .win-img").show().removeClass("fadeOut").addClass("zoomIn");
            (function () {
                $(containerID + " .win-img").removeClass("zoomIn").addClass("fadeOut");
            }).delay(4000);
        } else
            $(containerID + " .win-img").removeClass("zoomOut").removeClass("zoomIn");
    }
    function showWin(win) {
        if(win)
            $(containerID + " .win-game").show();
        else
            $(containerID).html("").addClass("lose-game");
    }
    return {
        render: renderView,
        freeDrink : showFreeDrink,
        win: showWin
    }
};