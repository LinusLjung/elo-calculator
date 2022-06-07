function Elo(options = Elo.defaultOptions) {
  this.options = Object.assign({}, Elo.defaultOptions, options);

  if (typeof this.options.rating !== 'number') {
    throw new TypeError('Expected type of option `rating` to be a number');
  }

  if (!Array.isArray(this.options.k)) {
    throw new TypeError('Expected type of option `k` to be an array');
  }

  if (this.options.k.length !== 3) {
    throw new Error('Expected length of option k to equal 3');
  }

  this.options.k.forEach(function(k) {
    if (typeof k !== 'number') {
      throw new TypeError('Expected each element of the option `k` to be a number');
    }
  });
}

Elo.defaultOptions = {
  rating: 1200,
  k: [40, 20, 10]
};

Elo.getExpectedResult = function(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

Elo.prototype.players = [];

Elo.prototype.calculateRating = function(playerA, playerB, result) {
  return playerA.rating + this.getK(playerA) * (result - Elo.getExpectedResult(playerA.rating, playerB.rating));
};

Elo.prototype.getK = function(player) {
  if (player.numberOfGamesPlayed < 30) {
    return this.options.k[0];
  }

  if (player.numberOfGamesPlayed >= 30 && Math.max(player.highestRating, player.rating) >= 2400) {
    return this.options.k[2];
  }

  return this.options.k[1];
};

Elo.prototype.createPlayer = function(rating, gamesPlayed, highestRating, name) {
  rating = typeof rating === 'number' ? rating : this.options.rating;
  gamesPlayed = typeof gamesPlayed === 'number' ? gamesPlayed : 0;
  highestRating = typeof highestRating === 'number' && highestRating > rating ? highestRating : rating;
  name = typeof name === 'string' ? name : '';

  const player = new Elo.Player(rating, gamesPlayed, highestRating, name);

  this.players.push(player);

  return player;
};

Elo.prototype.updateRatings = function(matches) {
  matches.forEach(([playerA, playerB, result]) => {
    const playerARating = this.calculateRating(playerA, playerB, result);
    const playerBRating = this.calculateRating(playerB, playerA, Math.abs(result - 1));

    [[playerA, playerARating], [playerB, playerBRating]].forEach(function([player, rating]) {
      player.rating = rating;
      player.numberOfGamesPlayed += 1;

      if (rating >= player.highestRating) {
        player.highestRating = rating;
      }
    });
  });
};

Elo.Player = function(rating, gamesPlayed, highestRating, name) {
  this.rating = rating;
  this.numberOfGamesPlayed = gamesPlayed;
  this.highestRating = highestRating;
  this.name = name;
};

module.exports = Elo;
