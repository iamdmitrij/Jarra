var Game_Over = {
    preload : function() {
    },

    create : function() {
        this.add.button(0, 0, 'gameover', this.startGame, this);

        game.add.text(150, 350, "Score:", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
        game.add.text(210, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },

    startGame: function () {
        this.state.start('Game');
    }
};