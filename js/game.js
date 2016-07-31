var player, apple, squareSize, score, speed, updateDelay,
    addNew, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value, obstacleX, obstacleY;

var MAX_HEIGHT = 500;
var MAX_WIDTH = 350;

var Game = {
    preload: function () {
        game.load.image('snake', './images/snake.png');
        game.load.image('apple', './images/star.png');
    },

    create: function () {
        player = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        squareSize = 50;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        addNew = false;                 // A variable used when an apple has been eaten.
        obstacle = {};
        obstacles = [];
        rowCount = 0;
        var keyboard = game.input.keyboard;

        keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.movePlayerUp, this);
        keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.movePlayerDown, this);
        keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.movePlayerLeft, this);
        keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.movePlayerRight, this);
        game.stage.backgroundColor = '#943E3E';

        this.createNewObstacle();

        player[0] = game.add.sprite(150, 450, 'snake'); // Parameters are (X coordinate, Y coordinate, image)

        // Genereate the first apple.
        this.generateApple();

        // Add Text to top of game.
        textStyle_Key = {font: "bold 14px sans-serif", fill: "#F0F0F0", align: "center"};
        textStyle_Value = {font: "bold 18px sans-serif", fill: "#F0F0F0", align: "center"};

        // Score.

        game.add.text(30, 20, "Score:", textStyle_Key);

        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);

        // Speed.
        game.add.text(500, 20, "Level:", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    gameOver: function () {
        game.state.start('Game_Over');
    },

    checkMoveCollision: function (cell) {
    },

    movePlayerUp: function () {
        var firstCell = player[player.length - 1];

        if (firstCell.y - squareSize >= 0) {
            lastCell = player.shift();
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y - squareSize;

            this.movePlayer(lastCell);
        }
    },

    movePlayerDown: function () {
        var firstCell = player[player.length - 1];

        if (firstCell.y + squareSize < MAX_HEIGHT) {
            lastCell = player.shift();
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y + squareSize;

            this.movePlayer(lastCell);
        }
    },

    movePlayerLeft: function () {
        var firstCell = player[player.length - 1];

        if (firstCell.x - squareSize >= 0) {
            lastCell = player.shift();
            lastCell.x = firstCell.x - squareSize;
            lastCell.y = firstCell.y;

            this.movePlayer(lastCell);
        }
    },

    movePlayerRight: function () {
        var firstCell = player[player.length - 1];

        if (firstCell.x + squareSize < MAX_WIDTH) {
            lastCell = player.shift();
            lastCell.x = firstCell.x + squareSize;
            lastCell.y = firstCell.y;

            this.movePlayer(lastCell);
        }
    },

    movePlayer: function (lastCell) {
        for (var j = 0; j < obstacles.length; j++) {
            if(obstacles[j].y === lastCell.y && obstacles[j].x === lastCell.x){
                this.gameOver();
            }
        }

        player.push(lastCell);
        this.jarCollision();
    },

    update: function () {
        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score / 5));
        // Update speed value on game screen.
        speedTextValue.text = '' + speed;

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (70 - speed) == 0) {
            // Change the last cell's coordinates relative to the head of the snake, according to the direction.
            var firstCell = player[player.length - 1];

            this.moveObstacles();
            this.pushPlayer();

            rowCount++;
            scoreTextValue.text = rowCount.toString();
            if (rowCount % 3 == 0) {
                this.createNewObstacle();
            }

            this.purgeObstacles();
            // Check for collision with self. Parameter is the head of the snake.
            this.selfCollision(firstCell);
            //this.checkCollision();
        }
    },

    createNewObstacle: function () {
        var rand1 = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
        var rand2 = Math.floor(Math.random() * (2 - 0 + 1)) + 1;

        var obstacle = new Phaser.Rectangle(rand1 * 50, -50, (rand1 + rand2) * 50, 50);
        game.world.sendToBack(obstacle);
        obstacles.push(obstacle);
    },

    moveObstacles: function () {
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].y += 50;
            game.debug.geom(obstacles[i], 'rgba(0,0,0,1)');
        }
    },

    pushPlayer: function () {
        for (var i = 0; i < player.length; i++) {
            for (var j = 0; j < obstacles.length; j++) {
                if (player[i].y == obstacles[j].y) {
                    player[i].y = player[i].y + squareSize;
                    this.movePlayer(player[i]);
                }

                if (player[i].y >= MAX_HEIGHT) {
                    this.gameOver();
                }
            }
        }
    },

    generateApple: function () {
        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    jarCollision: function () {
        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for (var i = 0; i < player.length; i++) {
            if (player[i].x == apple.x && player[i].y == apple.y) {

                // Next time the snake moves, a new block will be added to its length.
                addNew = true;

                // Destroy the old apple.
                apple.destroy();

                // Make a new one.
                this.generateApple();

                // Increase score.
                score++;

                // Refresh scoreboard.
                scoreTextValue.text = score.toString();
            }
        }
    },

    purgeObstacles: function () {
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].y > MAX_HEIGHT) {
                obstacles.splice(i, 1);
            }
        }
    },

    selfCollision: function (head) {
        // Check if the head of the snake overlaps with any part of the snake.
        for (var i = 0; i < player.length - 1; i++) {
            if (head.x == player[i].x && head.y == player[i].y) {

                // If so, go to game over screen.
                // game.state.start('Game_Over');
            }
        }
    }
};