$ = jQuery

$ ->

  socket = io.connect("")

  # Sadly socket.io is bugged and this won't be called
  # when authorization is rejected, only when there is
  # a connectivity problem (or the server is down)
  # https://github.com/LearnBoost/socket.io/issues/545
  socket.on 'error', (reason)->
    $('#server-message-box').show('slow')
    $('#server-message').html '<span class="label label-warning">Could not reach server. Make sure your browser supports cookies then reload this page.</span>'
  #######################################################

  socket.on 'connect', ->
    $('#server-message-box').show('slow')
    $('#server-message').html '<span class="label label-success">The server is operational and ready!</span>'

    $('#form-signin').submit (e)->
      e.preventDefault()
      socket.emit 'signin', {name:$('#input-name').val()}

    socket.on 'redirect', (data)->
      window.location.href = data.url

    socket.on 'bad username', (data)->
      $('#server-message-box').hide()
      $('#server-message-box').show('slow')
      $('#server-message').html '<span class="label label-important">' + data.error + '</span>'
