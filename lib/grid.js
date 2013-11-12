// Generated by CoffeeScript 1.6.1
(function() {
  var Grid, helper_count, helper_flatten;

  helper_flatten = function(array) {
    var element, flattened, _i, _len;
    flattened = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      element = array[_i];
      if (element instanceof Array) {
        flattened = flattened.concat(helper_flatten(element));
      } else {
        flattened.push(element);
      }
    }
    return flattened;
  };

  helper_count = function(string, substr) {
    var num, pos;
    num = pos = 0;
    if (!substr.length) {
      return 1 / 0;
    }
    while (pos = 1 + string.indexOf(substr, pos)) {
      num++;
    }
    return num;
  };

  module.exports = Grid = (function() {
    /*
    M * N grid filled with numbers
    0: wall
    1: terrain
    
    8: goal
    9: start
    */

    function Grid(M, N) {
      var i, j, _i, _ref;
      this.M = M != null ? M : 0;
      this.N = N != null ? N : this.M;
      this.grid = [];
      for (i = _i = 0, _ref = this.N - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.grid.push((function() {
          var _j, _ref1, _results;
          _results = [];
          for (j = _j = 0, _ref1 = this.M - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            _results.push(0);
          }
          return _results;
        }).call(this));
      }
    }

    Grid.prototype.print = function() {
      var i, j, _i, _j, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 0, _ref = this.N - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = this.M - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          process.stdout.write(this.grid[i][j].toString());
        }
        _results.push(process.stdout.write('\n'));
      }
      return _results;
    };

    Grid.prototype.randM = function() {
      return Math.floor(Math.random() * this.M);
    };

    Grid.prototype.randN = function() {
      return Math.floor(Math.random() * this.N);
    };

    Grid.prototype.set = function(x, y, n) {
      return this.grid[y][x] = n;
    };

    Grid.prototype.get = function(x, y) {
      return this.grid[y][x];
    };

    Grid.prototype.reset = function() {
      var x, y, _i, _ref, _results;
      _results = [];
      for (x = _i = 0, _ref = this.M - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (y = _j = 0, _ref1 = this.N - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
            _results1.push(this.set(x, y, 0));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Grid.prototype.getAdjacent = function(p) {
      var ret;
      ret = [];
      if (p[0] > 0) {
        ret.push([p[0] - 1, p[1]]);
      }
      if (p[0] < this.M - 1) {
        ret.push([p[0] + 1, p[1]]);
      }
      if (p[1] > 0) {
        ret.push([p[0], p[1] - 1]);
      }
      if (p[1] < this.N - 1) {
        ret.push([p[0], p[1] + 1]);
      }
      return ret;
    };

    Grid.prototype.getStartingPoint = function() {
      var x, y, _i, _j, _ref, _ref1;
      for (x = _i = 0, _ref = this.M - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        for (y = _j = 0, _ref1 = this.N - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if (this.get(x, y) === 9) {
            return [x, y];
          }
        }
      }
      return null;
    };

    Grid.prototype.getGoalPoint = function() {
      var x, y, _i, _j, _ref, _ref1;
      for (x = _i = 0, _ref = this.M - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        for (y = _j = 0, _ref1 = this.N - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if (this.get(x, y) === 8) {
            return [x, y];
          }
        }
      }
      return null;
    };

    Grid.prototype.createLevel = function() {
      var NeighborList, currentPoint, newPoint, p, solutionPath, validNeighborList, _i, _len;
      this.reset();
      solutionPath = [];
      currentPoint = [this.randM(), this.randN()];
      solutionPath.push(currentPoint);
      this.set(currentPoint[0], currentPoint[1], 9);
      while (true) {
        NeighborList = this.getAdjacent(currentPoint);
        validNeighborList = [];
        for (_i = 0, _len = NeighborList.length; _i < _len; _i++) {
          p = NeighborList[_i];
          if (this.get(p[0], p[1]) !== 1 && this.get(p[0], p[1]) !== 9) {
            validNeighborList.push(p);
          }
        }
        if (validNeighborList.length > 0) {
          newPoint = validNeighborList[Math.floor(Math.random() * validNeighborList.length)];
          this.set(newPoint[0], newPoint[1], 1);
          currentPoint = newPoint;
          solutionPath.push(currentPoint);
        } else {
          this.set(currentPoint[0], currentPoint[1], 8);
          break;
        }
      }
      return solutionPath;
    };

    Grid.prototype.count = function(t) {
      return helper_count((helper_flatten(this.grid)).join(""), t.toString());
    };

    Grid.prototype.createFullLevel = function(maxWalls, maxIterations) {
      var iterations, ret;
      if (maxWalls == null) {
        maxWalls = this.M * this.N;
      }
      if (maxIterations == null) {
        maxIterations = 10000;
      }
      ret = this.createLevel();
      iterations = 1;
      while (this.count(0) > maxWalls && iterations < maxIterations) {
        ret = this.createLevel();
        iterations += 1;
      }
      return ret;
    };

    Grid.prototype.checkSolution = function(path) {
      var checkGrid, i, norm, p, x, y, _i, _j, _k, _l, _len, _ref, _ref1, _ref2;
      if (path.length < 2) {
        return false;
      }
      if (this.get(path[0][0], path[0][1]) !== 9) {
        return false;
      }
      if (this.get(path[path.length - 1][0], path[path.length - 1][1]) !== 8) {
        return false;
      }
      for (i = _i = 0, _ref = path.length - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        norm = Math.abs(path[i][0] - path[i + 1][0]) + Math.abs(path[i][1] - path[i + 1][1]);
        if (norm !== 1) {
          return false;
        }
      }
      checkGrid = new Grid(this.M, this.N);
      for (x = _j = 0, _ref1 = this.M - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        for (y = _k = 0, _ref2 = this.N - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
          if (this.get(x, y) === 1) {
            checkGrid.set(x, y, 1);
          }
        }
      }
      for (_l = 0, _len = path.length; _l < _len; _l++) {
        p = path[_l];
        checkGrid.set(p[0], p[1], 0);
      }
      if (checkGrid.count(0) !== checkGrid.M * checkGrid.N) {
        return false;
      }
      return true;
    };

    return Grid;

  })();

}).call(this);