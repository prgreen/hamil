// Generated by CoffeeScript 1.6.1
(function() {

  module.exports = function(app, sio, h, sessionStore, siteSecret) {
    var connect, cookie, parseSignedCookie, robotAI, robotTimer;
    robotAI = function() {
      if (h.players['robot'].path.length < h.solution.length) {
        h.players['robot'].path.push(h.solution[h.players['robot'].path.length]);
      } else {
        sio.sockets.emit('level stats', h.stats());
        h.newLevel();
      }
      return sio.sockets.emit('update all', h.json());
    };
    robotTimer = setInterval(robotAI, 3000);
    connect = require('express/node_modules/connect');
    parseSignedCookie = connect.utils.parseSignedCookies;
    cookie = require('express/node_modules/cookie');
    sio.set('authorization', function(data, accept) {
      if (!data.headers.cookie) {
        return accept('Required session cookie not found.', false);
      }
      data.cookie = parseSignedCookie(cookie.parse(decodeURIComponent(data.headers.cookie)), siteSecret);
      data.sessionID = data.cookie['express.sid'];
      data.sessionStore = sessionStore;
      return sessionStore.load(data.sessionID, function(err, session) {
        if (err) {
          return accept('Error in session store.', false);
        }
        if (!session) {
          return accept('Session not found.', false);
        }
        data.session = session;
        return accept(null, true);
      });
    });
    return sio.sockets.on('connection', function(socket) {
      var hs;
      hs = socket.handshake;
      socket.on('signin', function(data) {
        if (data.name.length === 0) {
          socket.emit('bad username', {
            error: "Your name can't be empty!"
          });
          return;
        }
        if (data.name.length > 15) {
          socket.emit('bad username', {
            error: "Your name should be 15 characters or less."
          });
          return;
        }
        if (!/^[a-z0-9]+$/i.test(data.name)) {
          socket.emit('bad username', {
            error: "Your name can only contain simple letters a-z A-Z and numbers 0-9, no space, no special characters or accents."
          });
          return;
        }
        if (data.name in app.locals.users) {
          socket.emit('bad username', {
            error: "This name is already taken, please choose another one!"
          });
          return;
        }
        hs.session.username = data.name;
        app.locals.users[hs.session.username] = "active";
        hs.session.save();
        console.log('Connect: ' + hs.session.username);
        h.addPlayer(hs.session.username);
        return socket.emit('redirect', {
          url: '/game'
        });
      });
      socket.on('move', function(data) {
        var allStats, i, k, score, state, v, _i, _ref, _ref1;
        if (data.direction === "left") {
          h.players[hs.session.username].goLeft();
        } else if (data.direction === "up") {
          h.players[hs.session.username].goUp();
        } else if (data.direction === "right") {
          h.players[hs.session.username].goRight();
        } else if (data.direction === "down") {
          h.players[hs.session.username].goDown();
        }
        /*
        ENDGAME
        TODO : display stats, only change level when robot arrives or everybody arrived
        */

        if (h.players[hs.session.username].currentPoint()[0] === h.grid.getGoalPoint()[0] && h.players[hs.session.username].currentPoint()[1] === h.grid.getGoalPoint()[1]) {
          if (h.grid.checkSolution(h.players[hs.session.username].path)) {
            if (h.players[hs.session.username].score === 0) {
              score = h.players[hs.session.username].path.length;
              for (i = _i = 0, _ref = h.players['robot'].path.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                if (h.players[hs.session.username].path[i][0] === h.players['robot'].path[i][0] && h.players[hs.session.username].path[i][1] === h.players['robot'].path[i][1]) {
                  score -= 1;
                }
              }
              h.players[hs.session.username].score = score;
              allStats = true;
              _ref1 = h.players;
              for (k in _ref1) {
                v = _ref1[k];
                if (v.name !== 'robot' && v.score === 0) {
                  allStats = false;
                }
              }
              if (allStats) {
                sio.sockets.emit('level stats', h.stats());
                h.newLevel();
              } else {
                sio.sockets.emit('stats', h.stats());
              }
            }
          } else {
            h.players[hs.session.username].resetPath();
          }
        }
        state = h.json();
        return sio.sockets.emit('update all', state);
      });
      socket.on('reset', function() {
        var state;
        h.players[hs.session.username].resetPath();
        state = h.json();
        return socket.emit('update all', state);
      });
      socket.on('update all', function() {
        var state;
        state = h.json();
        return socket.emit('update all', state);
      });
      return socket.on('disconnect', function() {
        return app.locals.users[hs.session.username] = "inactive";
      });
    });
  };

}).call(this);