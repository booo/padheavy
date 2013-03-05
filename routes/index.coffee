exports.doc = (req, res) ->
  id = req.param "id"
  res.render "doc", { id: id, title: id }

exports.index = (req, res) ->
  res.render "index", { title: "Create a document" }
