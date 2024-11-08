class StroopTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StroopTestScene' });
    }

    preload() {
        // Preload any assets if necessary
    }

    create() {
        // Define colors and color names
        this.colors = ['Vermelho', 'Azul', 'Verde', 'Amarelo'];
        this.hexColors = { Vermelho: 0xff0000, Azul: 0x0000ff, Verde: 0x00ff00, Amarelo: 0xffff00 };

        // Display feedback text (initially hidden)
        this.feedbackText = this.add.text(400, 500, '', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5);

        // Start the first round
        this.startNewRound();
    }

    startNewRound() {
        // Clear any existing word and squares if they exist
        if (this.wordText) this.wordText.destroy();
        if (this.squares) this.squares.forEach(square => square.destroy());
        
        // Pick a random correct answer and a display color
        this.correctColor = Phaser.Utils.Array.GetRandom(this.colors);  // The correct answer based on the text
        let displayColor = Phaser.Utils.Array.GetRandom(this.colors);  // Color in which the word will be displayed

        // Display the word in a random color
        this.wordText = this.add.text(400, 150, displayColor, { fontSize: '48px', color: '#ffffff' })
            .setOrigin(0.5)
            .setTint(this.hexColors[this.correctColor]);

        // Generate answer squares with colors
        this.squares = [];
        Phaser.Utils.Array.Shuffle(this.colors).forEach((color, index) => {
            let square = this.add.rectangle(100 + (index * 200), 350, 100, 100, this.hexColors[color])
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.checkAnswer(color));

            this.squares.push(square);
        });
    }

    checkAnswer(selectedColor) {
        if (selectedColor === this.correctColor) {
            this.feedbackText.setText('Certo!').setTint(0x00ff00);
        } else {
            this.feedbackText.setText('Errado!').setTint(0xff0000);
        }
        
        // After a short delay, start a new round
        this.time.delayedCall(1000, () => {
            this.feedbackText.setText('');  // Clear feedback
            this.startNewRound();           // Start a new round
        });
    }
}




// Add this scene to your game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: StroopTestScene
};

const game = new Phaser.Game(config);
