var $ = require("jquery");

module.exports = function CountDownView(containerID) {
    function renderView(hour, minute, second) {
        var time = "";
        if(hour > 0) {
            time += hour + ":";
        }
        time += digitFormat(minute,2) + ":" + digitFormat(second, 2);
        $(containerID).html(time.replace(/1/g, ' 1'));
    }
    function hide() { $(containerID).hide() }
    function show() { $(containerID).show() }

    function digitFormat(number, digits) {
        var str = number +"";
        for(var i=str.length;i<digits;i++)
            str = "0"+str;
        return str;
    }

    return {
        render: renderView,
        hide: hide,
        show: show
    }
};