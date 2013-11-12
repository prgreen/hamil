
exports.game = (app)->
  (req, res) ->
    if not req.session.username?
      res.redirect('/')
    res.render "game", username: req.session.username
