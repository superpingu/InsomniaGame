$(function() {
    // Score :
    $(".odd-score-set").click(function() {
        var value = parseInt($(".odd-score").val());
        if(typeof value !== "undefined" && !isNaN(value)) {
            $.post("/teams/odd/score/" + value);
        } else
            alert("C'est n'importe quoi !");
    });
    $(".even-score-set").click(function() {
        var value = parseInt($(".even-score").val());
        if(typeof value !== "undefined" && !isNaN(value)) {
            $.post("/teams/even/score/" + value);
        } else
            alert("C'est n'importe quoi !");
    });
    $(".odd-score-reset").click(function() {
        if(confirm("Remettre à zéro le score des bleues ?")) {
            $.post("/teams/odd/score/0");
            $(".odd-score").val(0);
        }
    });
    $(".even-score-reset").click(function() {
        if(confirm("Remettre à zéro le score des rouges ?")) {
            $.post("/teams/even/score/0");
            $(".even-score").val(0);
        }
    });

    // happy hour :
    $(".start-time").click(function() {
        var value = parseInt($("#happyTime-duration").val());
        if(typeof value !== "undefined" && !isNaN(value)) {
            $.post("/happytime/start/", {duration: value, message: $("#happyTime-message").val()});
        } else
            alert("C'est n'importe quoi !");
    });
    $(".stop-time").click(function() {
        $.post("/happytime/stop/");
    });
    $(".update-message").click(function() {
        $.post("/happytime/message/", {message: $("#happyTime-message").val()});
    });

    // free drink proba
    $(".update-proba").click(function() {
        var value = parseFloat($("#probability").val().replace(/,/, "."));
        if(!isNaN(value)) {
            $.post("/freedrink/" + (value+"").replace(".", "p"));
        } else
            alert("C'est n'importe quoi !");
    });

    // end of game
    $(".update-endTime").click(function() {
        var value = $("#endTime").val();
        var hour = value.split(":");
        if(hour.length == 2 && !isNaN(parseInt(hour[0])) && !isNaN(parseInt(hour[1]))) {
            $.post("/game/end/" + value);
        } else
            alert("C'est n'importe quoi !");
    });
    $(".stop-game").click(function() {
        var minutes = parseInt($("#endCountdown").val());
        if(!isNaN(minutes)) {
            if (confirm("Lancer le compte à rebours (définitif) ?")) {
                $.post("/game/stop/"+minutes);
            }
        } else
            alert("C'est n'importe quoi !");
    });
});