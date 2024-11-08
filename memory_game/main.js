class MemoryCardGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MemoryCardGame' });
        this.cardsArray = []; // Array to hold card objects
        this.selectedCards = []; // Array to track the two cards selected by player
    }

    preload() {
        // Load card images (use placeholder images for demo)
        for (let i = 1; i <= 5; i++) {
            this.load.image(`card${i}`, `card${i}.png`);
        }
        this.load.image('back', 'cardBack.png'); // Card back image
    }

    create() {
        // Array of card types, duplicating to create pairs
        const cardTypes = ['card1', 'card2', 'card3', 'card4', 'card5'];
        const cards = Phaser.Utils.Array.Shuffle([...cardTypes, ...cardTypes]);

        // Set grid properties
        const cardSize = 100;
        const padding = 20;
        const startX = 150;
        const startY = 200;

        // Create card grid
        for (let i = 0; i < cards.length; i++) {
            const x = startX + (i % 5) * (cardSize + padding);
            const y = startY + Math.floor(i / 5) * (cardSize + padding);

            const card = this.add.image(x, y, 'back')
                .setInteractive()
                .setData('type', cards[i]) // Store card type
                .setData('isRevealed', false);

            // Add click event
            card.on('pointerdown', () => this.onCardClicked(card));
            this.cardsArray.push(card);
        }
    }

    onCardClicked(card) {
        if (card.getData('isRevealed') || this.selectedCards.length === 2) {
            return;
        }

        // Reveal the card
        card.setTexture(card.getData('type'));
        card.setData('isRevealed', true);
        this.selectedCards.push(card);

        // Check for match if two cards are selected
        if (this.selectedCards.length === 2) {
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const [firstCard, secondCard] = this.selectedCards;

        if (firstCard.getData('type') === secondCard.getData('type')) {
            // Matched: Keep both cards revealed
            this.selectedCards = [];
        } else {
            // Not a match: Hide both cards after a short delay
            this.time.delayedCall(1000, () => {
                firstCard.setTexture('back').setData('isRevealed', false);
                secondCard.setTexture('back').setData('isRevealed', false);
                this.selectedCards = [];
            });
        }
    }
}

// Add this scene to your game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MemoryCardGame
};

const game = new Phaser.Game(config);
