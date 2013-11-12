
$ = jQuery

SIZE = 600
ORIG_X = SIZE/20
ORIG_Y = SIZE/20
SIZE_X = SIZE/10
SIZE_Y = SIZE/10
COLOR = {}
COLOR[0] = 'black' # walls
COLOR[1] = 'yellow' # walkable path
COLOR[8] = 'red' # goal
COLOR[9] = 'green' # start
RECTS = []
WAITING = false
STATS = {}
LEVEL_STATS = {}

KEYS = {left:false, up:false, right:false, down:false, space:false}

# helper functions
helper_flatten = (array) ->
  flattened = []
  for element in array
    if element instanceof Array
      flattened = flattened.concat helper_flatten element
    else
      flattened.push element
  flattened
helper_count = (string, substr) ->
  num = pos = 0
  return 1/0 unless substr.length
  num++ while pos = 1 + string.indexOf substr, pos
  num
gridCount = (grid, t)-> # count the number of t in grid
      return helper_count((helper_flatten(grid)).join(""), t.toString())



$ ->

  can = document.getElementById('c')
  can.width = 99/100 *window.innerWidth;
  can.height = 99/100 * window.innerHeight;
  #ORIG_X += Math.floor(can.width/2 - SIZE/2)
  #ORIG_Y += Math.floor(can.height/2 - SIZE/2)

  USERNAME = $('#username').val()
  socket = io.connect("")
  canvas = new fabric.StaticCanvas('c')
  document.getElementById('c').focus();

  socket.on 'connect', ->

    keydownHandler = (e) ->
      if e.keyCode == 37 and not KEYS.left
        KEYS.left = true
        socket.emit('move', {direction:'left'})
      if e.keyCode == 38 and not KEYS.up
        KEYS.up = true
        socket.emit('move', {direction:'up'})
      if e.keyCode == 39 and not KEYS.right
        socket.emit('move', {direction:'right'})
        KEYS.right = true
      if e.keyCode == 40 and not KEYS.down
        socket.emit('move', {direction:'down'})
        KEYS.down = true
      if e.keyCode == 32 and not KEYS.space
        socket.emit('reset')
        KEYS.space = true
    keyupHandler = (e) ->
      if e.keyCode == 37
        KEYS.left = false
      if e.keyCode == 38
        KEYS.up = false
      if e.keyCode == 39
        KEYS.right = false
      if e.keyCode == 40
        KEYS.down = false
      if e.keyCode == 32
        KEYS.space = false
    socket.on 'update all', (data)->
      #console.log "#{JSON.stringify(data)}"

      # draw grid
      RECTS = []
      canvas.clear()
      for j in [0..data.grid_height-1]
        for i in [0..data.grid_width-1]
          square = data.grid[j][i]
          #console.log "#{square}"
          rect = new fabric.Rect({
            left: ORIG_X + i*SIZE_X,
            top: ORIG_Y + j*SIZE_Y,
            fill: COLOR[square],
            width: SIZE_X,
            height: SIZE_Y
            })
          RECTS.push rect
      for r in RECTS
        canvas.add(r)

      # draw player
      if not WAITING
        pos = data.players[USERNAME][data.players[USERNAME].length-1]
        #console.log "pos #{pos}"
        rect = new fabric.Rect({
              left: ORIG_X + pos[0]*SIZE_X,
              top: ORIG_Y + pos[1]*SIZE_Y,
              fill: 'blue',
              width: SIZE_X/2,
              height: SIZE_Y/2
              })
        RECTS.push rect
        canvas.add(rect)

      # draw robot
      pos = data.players['robot'][data.players['robot'].length-1]
      #console.log "pos #{pos}"
      rect = new fabric.Circle({
            left: ORIG_X + pos[0]*SIZE_X,
            top: ORIG_Y + pos[1]*SIZE_Y,
            fill: 'orange',
            radius: SIZE_X/4
            })
      RECTS.push rect
      canvas.add(rect)

      # draw robot path
      if data.players['robot'].length > 1
        for i in [0..data.players['robot'].length-2]
          pos = data.players['robot'][i]
          pos_next = data.players['robot'][i+1]
          rect = new fabric.Line([ORIG_X + pos[0]*SIZE_X, ORIG_Y + pos[1]*SIZE_Y, ORIG_X + pos_next[0]*SIZE_X, ORIG_Y + pos_next[1]*SIZE_Y],{fill:'orange',strokeWidth:1})
     
          RECTS.push rect
          canvas.add(rect)

      # draw other players
      for pl of data.players
        if pl isnt "robot" and pl isnt USERNAME
          pos = data.players[pl][data.players[pl].length-1]
          #console.log "username #{USERNAME} pl #{pl} pos #{pos}"
          rect = new fabric.Circle({
                left: ORIG_X + pos[0]*SIZE_X,
                top: ORIG_Y + pos[1]*SIZE_Y,
                fill: 'purple',
                radius: SIZE_X/8
                })
          RECTS.push rect
          canvas.add(rect) 

      # draw player path if > 1
      if data.players[USERNAME].length > 1 and not WAITING
        for i in [0..data.players[USERNAME].length-2]
          pos = data.players[USERNAME][i]
          rect = new fabric.Rect({
            left: ORIG_X + pos[0]*SIZE_X,
            top: ORIG_Y + pos[1]*SIZE_Y,
            fill: 'black',
            width: SIZE_X,
            height: SIZE_Y
            })
          RECTS.push rect
          canvas.add(rect)
        ###  
        for i in [0..data.players[USERNAME].length-2]
          pos = data.players[USERNAME][i]
          pos_next = data.players[USERNAME][i+1]
          rect = new fabric.Line([ORIG_X + pos[0]*SIZE_X, ORIG_Y + pos[1]*SIZE_Y, ORIG_X + pos_next[0]*SIZE_X, ORIG_Y + pos_next[1]*SIZE_Y],{fill:'grey',strokeWidth:1})
     
          RECTS.push rect
          canvas.add(rect)
        ###

      # display scores
      # TODO check boundaries 
      if LEVEL_STATS != {}
        scoreText = "PREVIOUS LEVEL\n"
        for s in LEVEL_STATS
          for k,v of s
            scoreText += k+' '+String(v)+'\n'
        score = new fabric.Text(scoreText, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 'black',
            fontWeight: 'bold',
            left: SIZE+100,
            top: SIZE*2/3,
            selectable: false
          })
        canvas.add(score)
      if STATS != {}
        scoreText = "CURRENT LEVEL\n"
        for s in STATS
          for k,v of s
            scoreText += k+' '+String(v)+'\n'
        score = new fabric.Text(scoreText, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 'red',
            fontWeight: 'bold',
            left: SIZE+100,
            top: SIZE*1/3,
            selectable: false
          })
        canvas.add(score)
      # draw timer
      timer = 3 * (gridCount(data.grid, 1) - data.players['robot'].length+2)
      score = new fabric.Text(timer.toString(), {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 'orange',
          fontWeight: 'bold',
          left: SIZE+100,
          top: 10,
          selectable: false
        })
      canvas.add(score)

      canvas.renderAll()

    socket.on 'stats', (data)->
      #console.log "#{JSON.stringify(data)}"
      for s in data
        for k,v of s
          if k == USERNAME and v != 0
            WAITING = true
      STATS = data
    socket.on 'level stats', (data)->
      #console.log "#{JSON.stringify(data)}"
      WAITING = false
      LEVEL_STATS = data
      STATS = {}

    socket.emit 'update all'
    document.getElementById('c').addEventListener('keydown', keydownHandler, false)
    document.getElementById('c').addEventListener('keyup', keyupHandler, false)

