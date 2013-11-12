
#
#  GET home page.
# 
exports.index = (req, res) ->
  req.session.machin = "bidule" # black magic to make sessions work
  if "username" of req.session
    res.redirect('/game')
  res.render "index",
    title: "Hamil"