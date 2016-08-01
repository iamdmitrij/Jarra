var Game_Over = {
    preload : function() {
        game.load.spritesheet('button', 'images/start_again.png', 128, 128);
        game.stage.backgroundColor = '#330000';
    },

    create : function() {
        this.add.button(120, 150, 'button', this.startGame, this);

        game.add.text(150, 330, "Score:", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
        game.add.text(210, 328, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },

    startGame: function () {
        this.state.start('Game');
    }
};