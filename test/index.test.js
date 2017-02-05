const Elo = require('../index');
const assert = require('chai').assert;

describe('Elo', function() {
  it('should initialize with default options if none are passed', function() {
    const elo = new Elo();

    assert.deepEqual(elo.options, Elo.defaultOptions);
  });

  it('should initialize with options passed to constructor', function() {
    const options = {
      rating: 1000,
      newProp: true
    };
    const elo = new Elo(options);

    assert.deepEqual(elo.options, Object.assign({}, Elo.defaultOptions, options));
  });

  it('should throw if any data passed as an option is not of correct type and structure', function() {
    assert.throws(function() {
      new Elo({
        rating: 'not a number'
      });
    }, TypeError, 'Expected type of option `rating` to be a number');

    assert.throws(function() {
      new Elo({
        k: 'not an array'
      });
    }, TypeError, 'Expected type of option `k` to be an array');

    assert.throws(function() {
      new Elo({
        k: [1, 2, 'not a number']
      });
    }, TypeError, 'Expected each element of the option `k` to be a number');

    assert.throws(function() {
      new Elo({
        k: []
      }, 'Expected length of option k to equal 3');
    });
  });

  describe('#makePlayer()', function() {
    it('should create a player with default settings if none are passed', function() {
      const elo = new Elo();
      const player = elo.createPlayer();

      assert.equal(player.rating, Elo.defaultOptions.rating);
      assert.equal(player.numberOfGamesPlayed, 0);
      assert.equal(player.highestRating, player.rating);
    });

    it('should create a player with options passed to constructor', function() {
      // Make sure passed rating is different from default rating
      const rating = Elo.defaultOptions.rating + 1;
      const elo = new Elo({
        rating: rating
      });
      const player = elo.createPlayer();

      assert.equal(rating, player.rating);
      assert.equal(0, player.numberOfGamesPlayed);
    });

    it('should create a player with settings passed to method', function() {
      // Make sure passed rating is different from default rating
      const rating = Elo.defaultOptions.rating + 1;
      const highestRating = rating + 1;
      const elo = new Elo();
      const player = elo.createPlayer(rating, 10, highestRating);

      assert.equal(player.rating, rating);
      assert.equal(player.numberOfGamesPlayed, 10);
      assert.equal(player.highestRating, highestRating);
    });
  });

  describe('#updateRatings()', function() {
    it('should update each player\'s rating', function() {
      const elo = new Elo();

      // Player stats and match results are designed to test that the conditions of the k value are correctly implemented
      const player1 = elo.createPlayer(1200, 28);
      const player2 = elo.createPlayer(1500, 10);
      const player3 = elo.createPlayer(1400, 30);
      const player4 = elo.createPlayer(2400, 100);
      const player5 = elo.createPlayer(2400, 10);

      const matches = [
        [player1, player2, 1],
        [player1, player3, 0],
        [player1, player4, .5],
        [player1, player4, 1],
        [player1, player5, .5],
      ];

      elo.updateRatings(matches);

      // Make assertions with a precision of 2 decimals
      assert.equal(player1.rating.toFixed(2), '1262.78');
      assert.equal(player2.rating.toFixed(2), '1466.04');
      assert.equal(player3.rating.toFixed(2), '1405.55');
      assert.equal(player4.rating.toFixed(2), '2385.02');
      assert.equal(player5.rating.toFixed(2), '2380.05');
    });
  });

  describe('#getK()', function() {
    it('should return the correct k value for a given player', function() {
      const elo = new Elo();

      const player1 = elo.createPlayer(1200, 0);
      const player2 = elo.createPlayer(2390, 29);
      const player3 = elo.createPlayer(2800, 30);
      const player4 = elo.createPlayer(1200, 30, 2400);
      const player5 = elo.createPlayer(1200, 30);

      // Make sure player2 goes above 2400 rating and 30 games played, and then drops below 2400 rating again
      const matches = [
        [player2, player3, 1],
        [player2, player1, 0]
      ];

      assert.equal(elo.getK(player1), 40);
      assert.equal(elo.getK(player2), 40);
      assert.equal(elo.getK(player3), 10);
      assert.equal(elo.getK(player4), 10);
      assert.equal(elo.getK(player5), 20);

      elo.updateRatings(matches);

      assert.equal(elo.getK(player2), 10);
    });
  });
});
