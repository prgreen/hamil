// Generated by CoffeeScript 1.6.1
(function() {
  var Player;

  module.exports = Player = (function() {

    function Player(name, grid, isRobot) {
      this.name = name;
      this.grid = grid;
      this.isRobot = isRobot != null ? isRobot : false;
      this.score = 0;
      this.path = [];
      this.path.push(this.grid.getStartingPoint());
    }

    Player.prototype.resetScore = function() {
      return this.score = 0;
    };

    Player.prototype.resetPath = function() {
      this.path = [];
      return this.path.push(this.grid.getStartingPoint());
    };

    Player.prototype.cancelLastMove = function() {
      if (this.path.length > 1) {
        return this.path.pop();
      }
    };

    Player.prototype.currentPoint = function() {
      return this.path[this.path.length - 1];
    };

    Player.prototype.alreadyVisited = function(p) {
      var point, _i, _len, _ref;
      _ref = this.path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        if (point[0] === p[0] && point[1] === p[1]) {
          return true;
        }
      }
      return false;
    };

    Player.prototype.goUp = function() {
      if (this.currentPoint().toString() !== this.grid.getGoalPoint().toString() && this.currentPoint()[1] > 0 && this.grid.get(this.currentPoint()[0], this.currentPoint()[1] - 1) !== 0 && !this.alreadyVisited([this.currentPoint()[0], this.currentPoint()[1] - 1])) {
        return this.path.push([this.currentPoint()[0], this.currentPoint()[1] - 1]);
      }
    };

    Player.prototype.goDown = function() {
      if (this.currentPoint().toString() !== this.grid.getGoalPoint().toString() && this.currentPoint()[1] < this.grid.N - 1 && this.grid.get(this.currentPoint()[0], this.currentPoint()[1] + 1) !== 0 && !this.alreadyVisited([this.currentPoint()[0], this.currentPoint()[1] + 1])) {
        return this.path.push([this.currentPoint()[0], this.currentPoint()[1] + 1]);
      }
    };

    Player.prototype.goLeft = function() {
      if (this.currentPoint().toString() !== this.grid.getGoalPoint().toString() && this.currentPoint()[0] > 0 && this.grid.get(this.currentPoint()[0] - 1, this.currentPoint()[1]) !== 0 && !this.alreadyVisited([this.currentPoint()[0] - 1, this.currentPoint()[1]])) {
        return this.path.push([this.currentPoint()[0] - 1, this.currentPoint()[1]]);
      }
    };

    Player.prototype.goRight = function() {
      if (this.currentPoint().toString() !== this.grid.getGoalPoint().toString() && this.currentPoint()[0] < this.grid.M - 1 && this.grid.get(this.currentPoint()[0] + 1, this.currentPoint()[1]) !== 0 && !this.alreadyVisited([this.currentPoint()[0] + 1, this.currentPoint()[1]])) {
        return this.path.push([this.currentPoint()[0] + 1, this.currentPoint()[1]]);
      }
    };

    return Player;

  })();

}).call(this);