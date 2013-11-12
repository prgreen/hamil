# class that contains all game state
Grid = require("./grid")
Player = require("./player")

module.exports = 
  class Hamil
    constructor: (M=10, N=10)->
      @grid = new Grid(M, N)
      @solution = @grid.createLevel()
      @players = {}
    addPlayer: (name)->
      @players[name] = new Player(name, @grid)
    addRobot: ->
      @players['robot'] = new Player('robot', @grid, true)
    removePlayer: (name)->
      delete @players[name]
    newLevel: ->
      @solution = @grid.createLevel()
      #reset players paths
      for k,v of @players
        v.resetPath()
      #reset player scores
        v.resetScore()

    json: ->
      state = {}
      state.grid = @grid.grid
      state.grid_width = @grid.M
      state.grid_height = @grid.N
      state.players = {}
      for k,v of @players
        state.players[k] = v.path
      return state
    stats: ->
      scores = []
      for k,v of @players
        if not v.isRobot
          score= {}
          score[v.name] = v.score
          scores.push score
      scores.sort((a,b)->a.score-b.score)
      return scores
