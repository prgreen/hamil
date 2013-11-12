
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

module.exports = 
  class Grid
    ###
    M * N grid filled with numbers
    0: wall
    1: terrain
    
    8: goal
    9: start
    ###
    constructor: (@M=0, @N=@M) ->   #M number of cols (j,x), N number of rows(i,y)
      @grid = []
      for i in [0..@N-1]
        @grid.push (0 for j in [0..@M-1])
    print: ->
      for i in [0..@N-1]
        for j in [0..@M-1]
          process.stdout.write(@grid[i][j].toString())
        process.stdout.write('\n')
    randM: ->
      return Math.floor(Math.random()*@M)
    randN: ->
      return Math.floor(Math.random()*@N)
    set: (x,y,n)->
      @grid[y][x] = n
    get: (x,y)->
      return @grid[y][x]
    reset: ->
      for x in [0..@M-1]
        for y in [0..@N-1]
          @set(x, y ,0)
    getAdjacent: (p)->
      ret = []
      if p[0] > 0
        ret.push [p[0]-1, p[1]]
      if p[0] < @M - 1
        ret.push [p[0]+1, p[1]]
      if p[1] > 0
        ret.push [p[0], p[1]-1]
      if p[1] < @N - 1
        ret.push [p[0], p[1]+1]
      return ret
    getStartingPoint: ->
      for x in [0..@M-1]
        for y in [0..@N-1]
          if @get(x, y) == 9
            return [x,y]
      return null
    getGoalPoint: ->
      for x in [0..@M-1]
        for y in [0..@N-1]
          if @get(x, y) == 8
            return [x,y]
      return null
    createLevel: ->
      # reset grid with walls(0)
      @reset()
      # start from a random point (9)
      solutionPath = []
      currentPoint = [@randM(), @randN()]
      solutionPath.push currentPoint
      @set(currentPoint[0],currentPoint[1],9)
      # go to a random adjacent non-visited point (1)
      while true
        NeighborList = @getAdjacent(currentPoint)
        validNeighborList = []
        for p in NeighborList
          if @get(p[0],p[1]) isnt 1 and @get(p[0],p[1]) isnt 9
            validNeighborList.push(p)
        if validNeighborList.length > 0
          newPoint = validNeighborList[Math.floor(Math.random()*validNeighborList.length)]
          @set(newPoint[0], newPoint[1], 1)
          currentPoint = newPoint
          solutionPath.push currentPoint
        else
          # stop when no adjacent point available, it's the goal (8)
          @set(currentPoint[0], currentPoint[1], 8)
          break
      # non-visited points are still walls(0)
      # return final path solution
      return solutionPath
    count: (t)-> # count the number of t in grid
      return helper_count((helper_flatten(@grid)).join(""), t.toString())
    createFullLevel: (maxWalls=@M*@N, maxIterations=10000)->
      #TODO create levels in temp grid and keep only the best results
      ret = @createLevel()
      iterations = 1
      while @count(0) > maxWalls and iterations < maxIterations
        ret = @createLevel()
        iterations += 1
      return ret
    checkSolution: (path)->
      if (path.length < 2)
        return false
      if @get(path[0][0], path[0][1]) != 9
        return false
      if @get(path[path.length-1][0], path[path.length-1][1]) != 8
        return false
      #consecutive points must vary by 1 in x or y
      for i in [0..path.length-2]
        norm = Math.abs(path[i][0]-path[i+1][0]) + Math.abs(path[i][1]-path[i+1][1])
        if norm !=1
          return false
      #all points marked 1 must be traversed
      checkGrid = new Grid(@M, @N)
      for x in [0..@M-1]
        for y in [0..@N-1]
          if @get(x,y) == 1
            checkGrid.set(x, y, 1)
      for p in path
        checkGrid.set(p[0], p[1], 0)
      if checkGrid.count(0) != checkGrid.M * checkGrid.N
        return false 
      return true


