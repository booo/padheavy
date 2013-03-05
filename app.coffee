express = require("express")
routes = require("./routes")
http = require("http")
path = require("path")

sharejs = require("share").server

app = express()

app.configure ->
  app.set "port", process.env.PORT or 3000
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(path.join(__dirname, "public"))

app.configure "development", ->
  app.use express.errorHandler()

app.get "/docs/:id", routes.doc
app.get "/docs", routes.doc

app.get "/", routes.index

sharejsOptions =
  db:
    type: "redis"

sharejs.attach app, sharejsOptions

http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")

