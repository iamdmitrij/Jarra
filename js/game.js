var snake, apple, squareSize, score, speed, updateDelay,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var Game = {
    preload: function () {
        game.load.image('snake', './images/snake.png');
        game.load.image('apple', './images/star.png');
    },

    create: function () {
        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        squareSize = 50;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        addNew = false;                 // A variable used when an apple has been eaten.

        var keyboard = game.input.keyboard;
        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.movePlayerUp, this);
        keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.movePlayerDown, this);
        keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.movePlayerLeft, this);
        keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.movePlayerRight, this);
        game.stage.backgroundColor = '#943E3E';

        snake[0] = game.add.sprite(150, 450, 'snake'); // Parameters are (X coordinate, Y coordinate, image)

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

    movePlayerUp: function () {
        var firstCell = snake[snake.length - 1];

        if (firstCell.y - squareSize >= 0) {
            lastCell = snake.shift();
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y - squareSize;

            this.movePlayer(lastCell);
        }
    },

    movePlayerDown: function () {
        var firstCell = snake[snake.length - 1];

        if (firstCell.y + squareSize < 500) {
            lastCell = snake.shift();
            lastCell.x = firstCell.x;
            lastCell.y = firstCell.y + squareSize;

            this.movePlayer(lastCell);
        }
    },

    movePlayerLeft: function () {
        var firstCell = snake[snake.length - 1];

        if (firstCell.x - squareSize >= 0) {
            lastCell = snake.shift();
            lastCell.x = firstCell.x - squareSize;
            lastCell.y = firstCell.y;

            this.movePlayer(lastCell);
        }
    },

    movePlayerRight: function () {
        var firstCell = snake[snake.length - 1];

        if (firstCell.x + squareSize < 300) {
            lastCell = snake.shift();
            lastCell.x = firstCell.x + squareSize;
            lastCell.y = firstCell.y;

            this.movePlayer(lastCell);
        }
    },

    movePlayer: function (lastCell) {
        snake.push(lastCell);
        this.jarCollision();
    },

    update: function () {
        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score / 5));
        // Update speed value on game screen.
        speedTextValue.text = '' + speed;

        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (5000 - speed) == 0) {
            // Change the last cell's coordinates relative to the head of the snake, according to the direction.
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift();
            oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // End of snake movement.

            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
            if (addNew) {
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Check for collision with self. Parameter is the head of the snake.
            this.selfCollision(firstCell);
        }
    },

    generateApple: function () {
        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        // Add a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    jarCollision: function () {
        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x == apple.x && snake[i].y == apple.y) {

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

    selfCollision: function (head) {

        // Check if the head of the snake overlaps with any part of the snake.
        for (var i = 0; i < snake.length - 1; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {

                // If so, go to game over screen.
                game.state.start('Game_Over');
            }
        }
    }
};