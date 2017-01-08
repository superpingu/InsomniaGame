require("sugar");

module.exports = function CountDown(view) {
    var endTime;
    var endCallback = function() { console.log("counter finished") };
    var timer = updateView;

    function updateView() {
        if(endTime.isBefore("now")) { // on countdown end
            stop();
            endCallback();
        } else {
            var hour = endTime.hoursFromNow();
            var minutes = endTime.minutesFromNow();
            var seconds = endTime.secondsFromNow() - 60 * minutes;
            minutes = minutes - 60 * hour;
            seconds = seconds < 0 ? 0 : seconds;
            view.render(hour, minutes, seconds);
        }
    }
    function start(minutes) {
        endTime = minutes.minutesAfter(Date.now());
        timer.every(1000);
        view.show();
        updateView();
    }
    function stop() {
        timer.cancel();
        view.hide();
    }
    function setEndCallback(callback) {
        endCallback = callback;
    }

    return {
        start : start,
        stop: stop,
        end: setEndCallback,
        hide: view.hide
    }
};
