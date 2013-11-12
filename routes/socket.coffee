module.exports = (app, sio, h, sessionStore, siteSecret)->

  # start robot solver
  robotAI = ->
    #add one point to path from solution
    if h.players['robot'].path.length < h.solution.length
      h.players['robot'].path.push h.solution[h.players['robot'].path.length]
    else
      sio.sockets.emit 'level stats', h.stats()
      h.newLevel()
    sio.sockets.emit 'update all', h.json()
  robotTimer = setInterval(robotAI, 3000)

  connect           = require 'express/node_modules/connect'
  parseSignedCookie = connect.utils.parseSignedCookies
  cookie            = require 'express/node_modules/cookie'

  sio.set 'authorization', (data, accept)->
    if not data.headers.cookie
      return accept('Required session cookie not found.', false)
    data.cookie = parseSignedCookie(cookie.parse(decodeURIComponent(data.headers.cookie)), siteSecret)
    data.sessionID = data.cookie['express.sid']
    data.sessionStore = sessionStore
    sessionStore.load data.sessionID, (err, session)->
      if err
        return accept('Error in session store.', false)
      if !session
        return accept('Session not found.', false)
      data.session = session

      return accept(null, true)
    

  sio.sockets.on 'connection', (socket)->
    hs = socket.handshake
    #console.log('A socket with sessionID ' + hs.sessionID + ' connected.')

    socket.on 'signin', (data)->
      if data.name.length == 0
        socket.emit('bad username', {error:"Your name can't be empty!"})
        return
      if data.name.length > 15
        socket.emit('bad username', {error:"Your name should be 15 characters or less."})
        return
      if not /^[a-z0-9]+$/i.test(data.name)
        socket.emit('bad username', {error:"Your name can only contain simple letters a-z A-Z and numbers 0-9, no space, no special characters or accents."})
        return
      if data.name of app.locals.users
        socket.emit('bad username', {error:"This name is already taken, please choose another one!"})
        return
      hs.session.username = data.name
      app.locals.users[hs.session.username] = "active"
      hs.session.save()
      console.log ('Connect: ' + hs.session.username)
      h.addPlayer(hs.session.username)
      socket.emit('redirect', {url:'/game'})

    socket.on 'move', (data)->
      if data.direction == "left"
        h.players[hs.session.username].goLeft()
      else if data.direction == "up"
        h.players[hs.session.username].goUp()
      else if data.direction == "right"
        h.players[hs.session.username].goRight()
      else if data.direction == "down"
        h.players[hs.session.username].goDown()
      #console.log "#{hs.session.username} wants to move #{data.direction}"
      #console.log "path = #{h.players[hs.session.username].path}"
      ###
      ENDGAME
      TODO : display stats, only change level when robot arrives or everybody arrived
      ###
      if h.players[hs.session.username].currentPoint()[0] == h.grid.getGoalPoint()[0] and h.players[hs.session.username].currentPoint()[1] == h.grid.getGoalPoint()[1]
        if h.grid.checkSolution(h.players[hs.session.username].path)
          if h.players[hs.session.username].score == 0
            # score = length of path - common points with robot path
            score = h.players[hs.session.username].path.length
            for i in [0..h.players['robot'].path.length-1]
              if h.players[hs.session.username].path[i][0] == h.players['robot'].path[i][0] and h.players[hs.session.username].path[i][1] == h.players['robot'].path[i][1]
                score -= 1
            h.players[hs.session.username].score = score
            #if every human score is non zero, change level
            #else send stats
            allStats = true
            for k,v of h.players
              if v.name != 'robot' and v.score == 0
                allStats = false
            if allStats
              sio.sockets.emit 'level stats', h.stats()
              h.newLevel()
            else
              sio.sockets.emit 'stats', h.stats()
        else
          h.players[hs.session.username].resetPath()
      state = h.json()
      #state["username"]=hs.session.username 
      sio.sockets.emit 'update all', state

    socket.on 'reset', ->
      h.players[hs.session.username].resetPath()
      state = h.json()
      #state["username"]=hs.session.username 
      socket.emit 'update all', state

    socket.on 'update all', ->
      state = h.json()
      #state["username"]=hs.session.username 
      socket.emit 'update all', state
      #console.log "#{hs.session.username} wants to update everything"

    socket.on 'disconnect', ->
      #console.log('A socket with sessionID ' + hs.sessionID + ' disconnected.')
      #console.log ('Disconnect: ' + hs.session.username)
      app.locals.users[hs.session.username] = "inactive"

      #TODO destroy session of players who leave game

