// Create a new Phaser game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let balls;
let cursors;
let score = 0;
let scoreText;
let ballTimer;  // Timer for creating balls
let ballInterval = 1500;  // Interval for new balls to appear (in milliseconds)

function preload() {
    // Load assets
    this.load.image('player', 'egg_basket.png');
    this.load.image('ball', 'egg.png');
    this.load.image('background', 'background.png'); // Load the background image

}

function create() {

    this.add.image(400, 300, 'background').setOrigin(0.5, 0.5).setDisplaySize(config.width, config.height);

    // Create player
    player = this.physics.add.image(400, 550, 'player').setImmovable();
    player.setScale(0.5);
    player.setCollideWorldBounds(true);

    // Create balls group
    balls = this.physics.add.group();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
    });

    // Setup arrow keys for player movement
    cursors = this.input.keyboard.createCursorKeys();

    // Create timer for spawning balls
    ballTimer = this.time.addEvent({
        delay: ballInterval,
        callback: spawnBall,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Move player with arrow keys
    if (cursors.left.isDown) {
        player.x -= 5;
    }
    if (cursors.right.isDown) {
        player.x += 5;
    }

    // Check for collisions between player and balls
    this.physics.overlap(player, balls, catchBall, null, this);
    console.log(config.height)
    // Check if any ball has fallen below the screen and remove it
    balls.children.iterate(function (ball) {
        if (ball.y == config.height) {
            score -= 10;
            scoreText.setText('Score: ' + score);
            console.log(score);
            // Handle ball that wasn't caught (falling off the screen)
            ball.setActive(false);  // Stop physics updates
            ball.setVisible(false); // Hide the ball
            ball.body.stop();       // Stop the ball's body movement
            ball.destroy();         // Destroy the ball and free memory

        }
    });
}

function spawnBall() {
    // Random X position for the ball
    let randomX = Phaser.Math.Between(50, config.width - 50);

    // Create a new ball at the top of the screen
    let ball = balls.create(randomX, 0, 'ball');

    // Set the ball to fall vertically with a random speed
    ball.setVelocityY(Phaser.Math.Between(200, 300));

    // Set ball bounce off the top of the screen
    ball.setBounce(0.5);
}

function catchBall(player, ball) {
    // When the ball is caught, stop its movement, hide it, and destroy it.
    ball.setActive(false);  // Stop physics updates
    ball.setVisible(false); // Hide the ball
    ball.body.stop();       // Stop the ball's body movement
    ball.destroy();         // Destroy the ball

    // Increase score only when the ball is caught
    score += 10;
    scoreText.setText('Score: ' + score);
}
