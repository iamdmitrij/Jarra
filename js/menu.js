var Menu = {
    preload : function() {
        // Let's just start the game for now
        this.state.start('Game');
    },

    create: function () {
        this.add.button(0, 0, 'menu', this.startGame, this);
    },

    startGame: function () {
        this.state.start('Game');
    }
};