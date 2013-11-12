module.exports =
  class Player
    constructor: (@name, @grid, @isRobot = false)->
      @score = 0
      @path = []
      @path.push(@grid.getStartingPoint())
      #console.log "CONSTRUCTOR for #{@name} path=#{@path}"
    resetScore: ->
      @score = 0
    resetPath: ->
      @path = []
      @path.push(@grid.getStartingPoint())
    cancelLastMove: ->
      if @path.length > 1
        @path.pop()
    currentPoint: ->
      return @path[@path.length-1]
    alreadyVisited: (p) ->
      for point in @path
        if point[0] == p[0] and point[1] == p[1]
          return true
      return false
    goUp: ->
      if @currentPoint().toString() !=  @grid.getGoalPoint().toString() and @currentPoint()[1] > 0 and @grid.get(@currentPoint()[0],@currentPoint()[1]-1) != 0 and not @alreadyVisited([@currentPoint()[0],@currentPoint()[1]-1])
        @path.push [@currentPoint()[0],@currentPoint()[1]-1]
    goDown: ->
      if @currentPoint().toString() !=  @grid.getGoalPoint().toString() and @currentPoint()[1] < @grid.N - 1 and @grid.get(@currentPoint()[0],@currentPoint()[1]+1) != 0 and not @alreadyVisited([@currentPoint()[0],@currentPoint()[1]+1])
        @path.push [@currentPoint()[0],@currentPoint()[1]+1]
    goLeft: ->
      if @currentPoint().toString() !=  @grid.getGoalPoint().toString() and @currentPoint()[0] > 0 and @grid.get(@currentPoint()[0]-1,@currentPoint()[1]) != 0 and not @alreadyVisited([@currentPoint()[0]-1,@currentPoint()[1]])
        @path.push [@currentPoint()[0]-1,@currentPoint()[1]]
    goRight: ->
      if @currentPoint().toString() !=  @grid.getGoalPoint().toString() and @currentPoint()[0] < @grid.M - 1 and @grid.get(@currentPoint()[0]+1,@currentPoint()[1]) != 0 and not @alreadyVisited([@currentPoint()[0]+1,@currentPoint()[1]])
        @path.push [@currentPoint()[0]+1,@currentPoint()[1]]

