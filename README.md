# Elo

The Elo rating system is a method for calculating the relative skill levels of players in competitor-versus-competitor games.
A player's Elo rating is represented by a number which increases or decreases depending on the outcome of games between rated players.
After every game, the winning player takes points from the losing one.
The difference between the ratings of the winner and loser determines the total number of points gained or lost after a game.
See https://en.wikipedia.org/wiki/Elo_rating_system for more information.


## Installation
```
npm install elo-calculator
```

## Usage

In node.js, require the module:
```js
const Elo = require('elo-calculator');
```

First we initialize the Elo calculator, optionally passing options.
```js
const elo = new Elo({
  // The rating of which each initialized player will start with
  rating: 1200,
  // The coefficient, called the K-factor, is the maximum possible adjustment per game.
  // Which value is used depends on one or more the following points:
  // 1. The number of games the player has played
  // 2. The current rating of the player
  // 3. The highest rating the player has ever had.
  // Weak and new players generally have a higher coefficient than stronger, more experienced players.
  // The conditions used to apply a k-factor are based the ones used by the World Chess Federation (http://www.fide.com/fide/handbook.html?id=172&view=article)
  k: [40, 20, 10]
});
```

Then we create players, optionally passing options to the player.
```js
// const player = elo.createPlayer(currentRating, numberOfGamesPlayed, highestRating);
const player1 = elo.createPlayer();
const player2 = elo.createPlayer(1900, 50, 1950);
const player3 = elo.createPlayer(1550);
```

The ratings of the players are updated by feeding the calculator with match results:
```js
elo.updateRatings([
  [player1, player2, 1], // Player 1 wins
  [player2, player1, 0], // Player 2 loses
  [player2, player3, .5] // Player 2 and player 3 draws the game
]);
```

Players are stored in the `players` property of the instance of `Elo`. Iterate through the players and display the ratings:

```js
elo.players.forEach(function(player, i) {
  console.log(`Player ${i + 1} has played ${player.numberOfGamesPlayed} and has a rating of ${Math.round(player.rating)}`);
});
```
