express = require "express"
routes  = require "./routes"
game    = require "./routes/game"
http    = require "http"
path    = require "path"

# CONFIGURATION
app          = express()
sessionStore = new express.session.MemoryStore()
siteSecret   = "Shhh it's a secret, can't tell you"

app.configure ->
  app.set "port", process.env.PORT or 3000
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser(siteSecret)
  app.use express.session({key:'express.sid', store:sessionStore})
  app.use app.router
  app.use require("stylus").middleware(__dirname + "/public")
  app.use express.static(path.join(__dirname, "public"))

app.configure "development", ->
  app.use express.errorHandler()

# URLS
app.get "/", routes.index
app.get "/game", game.game(app)

# RUN SERVER
server = http.createServer(app)
sio    = require('socket.io').listen(server)
sio.set('log level', 1);

server.listen app.get("port"), ->
  console.log ("Express server listening on port " + app.get("port"))

# GAME and SOCKET.IO
Hamil = require('./lib/hamil')
h = new Hamil(10, 10)
h.addRobot()
app.locals.users = {robot:"robot"}
require('./routes/socket')(app, sio, h, sessionStore, siteSecret)

# REMOVE EVERYTHING BELOW
###
Grid = require "./lib/grid"

g = new Grid(2,10)
sol = g.createFullLevel()
for p in sol
  console.log(p[0],p[1])
console.log('-----')
g.print()
console.log('-----')
console.log ("solution checked OK") if g.checkSolution(sol)


Player = require "./lib/player"

p1 = new Player("toto", g)
for i in [1..10]
  console.log "PATH START"
  for p in p1.path
    console.log "#{p[0]}, #{p[1]}"
  console.log "PATH END"
  p1.goUp()
console.log ("solution checked OK") if g.checkSolution(p1.path)
###

###
Hamil = require('./lib/hamil')

h = new Hamil(5,10)
h.grid.print()
h.addPlayer("toto")
h.addPlayer("tutu")
console.log h.json()
h.newLevel()
h.grid.print()
h.players.toto.goRight()
h.players.tutu.goUp()
console.log h.json()
###