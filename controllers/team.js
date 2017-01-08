module.exports = function Team(name, view) {
    var score = 0;

    function render() {
        view.render({score: score})
    }
    function addPoints(points) {
        score += points;
        render();
    }
    function getsetScore(newscore) {
        if(newscore) {
            if(typeof newscore === "string")
                newscore = parseInt(newscore);
            score = newscore;
            render();
        }
        return score;
    }
    return {
        render: render,
        win : view.win,
        score: getsetScore,
        addPoints: addPoints,
        freeDrink : view.freeDrink
    }
};