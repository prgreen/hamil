// Generated by CoffeeScript 1.6.1
(function() {
  var $, COLOR, KEYS, LEVEL_STATS, ORIG_X, ORIG_Y, RECTS, SIZE, SIZE_X, SIZE_Y, STATS, WAITING, gridCount, helper_count, helper_flatten;

  $ = jQuery;

  SIZE = 600;

  ORIG_X = SIZE / 20;

  ORIG_Y = SIZE / 20;

  SIZE_X = SIZE / 10;

  SIZE_Y = SIZE / 10;

  COLOR = {};

  COLOR[0] = 'black';

  COLOR[1] = 'yellow';

  COLOR[8] = 'red';

  COLOR[9] = 'green';

  RECTS = [];

  WAITING = false;

  STATS = {};

  LEVEL_STATS = {};

  KEYS = {
    left: false,
    up: false,
    right: false,
    down: false,
    space: false
  };

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

  gridCount = function(grid, t) {
    return helper_count((helper_flatten(grid)).join(""), t.toString());
  };

  $(function() {
    var USERNAME, can, canvas, socket;
    can = document.getElementById('c');
    can.width = 99 / 100 * window.innerWidth;
    can.height = 99 / 100 * window.innerHeight;
    USERNAME = $('#username').val();
    socket = io.connect("");
    canvas = new fabric.StaticCanvas('c');
    document.getElementById('c').focus();
    return socket.on('connect', function() {
      var keydownHandler, keyupHandler;
      keydownHandler = function(e) {
        if (e.keyCode === 37 && !KEYS.left) {
          KEYS.left = true;
          socket.emit('move', {
            direction: 'left'
          });
        }
        if (e.keyCode === 38 && !KEYS.up) {
          KEYS.up = true;
          socket.emit('move', {
            direction: 'up'
          });
        }
        if (e.keyCode === 39 && !KEYS.right) {
          socket.emit('move', {
            direction: 'right'
          });
          KEYS.right = true;
        }
        if (e.keyCode === 40 && !KEYS.down) {
          socket.emit('move', {
            direction: 'down'
          });
          KEYS.down = true;
        }
        if (e.keyCode === 32 && !KEYS.space) {
          socket.emit('reset');
          return KEYS.space = true;
        }
      };
      keyupHandler = function(e) {
        if (e.keyCode === 37) {
          KEYS.left = false;
        }
        if (e.keyCode === 38) {
          KEYS.up = false;
        }
        if (e.keyCode === 39) {
          KEYS.right = false;
        }
        if (e.keyCode === 40) {
          KEYS.down = false;
        }
        if (e.keyCode === 32) {
          return KEYS.space = false;
        }
      };
      socket.on('update all', function(data) {
        var i, j, k, pl, pos, pos_next, r, rect, s, score, scoreText, square, timer, v, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _ref, _ref1, _ref2, _ref3;
        RECTS = [];
        canvas.clear();
        for (j = _i = 0, _ref = data.grid_height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; j = 0 <= _ref ? ++_i : --_i) {
          for (i = _j = 0, _ref1 = data.grid_width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            square = data.grid[j][i];
            rect = new fabric.Rect({
              left: ORIG_X + i * SIZE_X,
              top: ORIG_Y + j * SIZE_Y,
              fill: COLOR[square],
              width: SIZE_X,
              height: SIZE_Y
            });
            RECTS.push(rect);
          }
        }
        for (_k = 0, _len = RECTS.length; _k < _len; _k++) {
          r = RECTS[_k];
          canvas.add(r);
        }
        if (!WAITING) {
          pos = data.players[USERNAME][data.players[USERNAME].length - 1];
          rect = new fabric.Rect({
            left: ORIG_X + pos[0] * SIZE_X,
            top: ORIG_Y + pos[1] * SIZE_Y,
            fill: 'blue',
            width: SIZE_X / 2,
            height: SIZE_Y / 2
          });
          RECTS.push(rect);
          canvas.add(rect);
        }
        pos = data.players['robot'][data.players['robot'].length - 1];
        rect = new fabric.Circle({
          left: ORIG_X + pos[0] * SIZE_X,
          top: ORIG_Y + pos[1] * SIZE_Y,
          fill: 'orange',
          radius: SIZE_X / 4
        });
        RECTS.push(rect);
        canvas.add(rect);
        if (data.players['robot'].length > 1) {
          for (i = _l = 0, _ref2 = data.players['robot'].length - 2; 0 <= _ref2 ? _l <= _ref2 : _l >= _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
            pos = data.players['robot'][i];
            pos_next = data.players['robot'][i + 1];
            rect = new fabric.Line([ORIG_X + pos[0] * SIZE_X, ORIG_Y + pos[1] * SIZE_Y, ORIG_X + pos_next[0] * SIZE_X, ORIG_Y + pos_next[1] * SIZE_Y], {
              fill: 'orange',
              strokeWidth: 1
            });
            RECTS.push(rect);
            canvas.add(rect);
          }
        }
        for (pl in data.players) {
          if (pl !== "robot" && pl !== USERNAME) {
            pos = data.players[pl][data.players[pl].length - 1];
            rect = new fabric.Circle({
              left: ORIG_X + pos[0] * SIZE_X,
              top: ORIG_Y + pos[1] * SIZE_Y,
              fill: 'purple',
              radius: SIZE_X / 8
            });
            RECTS.push(rect);
            canvas.add(rect);
          }
        }
        if (data.players[USERNAME].length > 1 && !WAITING) {
          for (i = _m = 0, _ref3 = data.players[USERNAME].length - 2; 0 <= _ref3 ? _m <= _ref3 : _m >= _ref3; i = 0 <= _ref3 ? ++_m : --_m) {
            pos = data.players[USERNAME][i];
            rect = new fabric.Rect({
              left: ORIG_X + pos[0] * SIZE_X,
              top: ORIG_Y + pos[1] * SIZE_Y,
              fill: 'black',
              width: SIZE_X,
              height: SIZE_Y
            });
            RECTS.push(rect);
            canvas.add(rect);
          }
          /*  
          for i in [0..data.players[USERNAME].length-2]
            pos = data.players[USERNAME][i]
            pos_next = data.players[USERNAME][i+1]
            rect = new fabric.Line([ORIG_X + pos[0]*SIZE_X, ORIG_Y + pos[1]*SIZE_Y, ORIG_X + pos_next[0]*SIZE_X, ORIG_Y + pos_next[1]*SIZE_Y],{fill:'grey',strokeWidth:1})
               
            RECTS.push rect
            canvas.add(rect)
          */

        }
        if (LEVEL_STATS !== {}) {
          scoreText = "PREVIOUS LEVEL\n";
          for (_n = 0, _len1 = LEVEL_STATS.length; _n < _len1; _n++) {
            s = LEVEL_STATS[_n];
            for (k in s) {
              v = s[k];
              scoreText += k + ' ' + String(v) + '\n';
            }
          }
          score = new fabric.Text(scoreText, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 'black',
            fontWeight: 'bold',
            left: SIZE + 100,
            top: SIZE * 2 / 3,
            selectable: false
          });
          canvas.add(score);
        }
        if (STATS !== {}) {
          scoreText = "CURRENT LEVEL\n";
          for (_o = 0, _len2 = STATS.length; _o < _len2; _o++) {
            s = STATS[_o];
            for (k in s) {
              v = s[k];
              scoreText += k + ' ' + String(v) + '\n';
            }
          }
          score = new fabric.Text(scoreText, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 'red',
            fontWeight: 'bold',
            left: SIZE + 100,
            top: SIZE * 1 / 3,
            selectable: false
          });
          canvas.add(score);
        }
        timer = 3 * (gridCount(data.grid, 1) - data.players['robot'].length + 2);
        score = new fabric.Text(timer.toString(), {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 'orange',
          fontWeight: 'bold',
          left: SIZE + 100,
          top: 10,
          selectable: false
        });
        canvas.add(score);
        return canvas.renderAll();
      });
      socket.on('stats', function(data) {
        var k, s, v, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          s = data[_i];
          for (k in s) {
            v = s[k];
            if (k === USERNAME && v !== 0) {
              WAITING = true;
            }
          }
        }
        return STATS = data;
      });
      socket.on('level stats', function(data) {
        WAITING = false;
        LEVEL_STATS = data;
        return STATS = {};
      });
      socket.emit('update all');
      document.getElementById('c').addEventListener('keydown', keydownHandler, false);
      return document.getElementById('c').addEventListener('keyup', keyupHandler, false);
    });
  });

}).call(this);
