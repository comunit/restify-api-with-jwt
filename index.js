const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");

const server = restify.createServer();

// middleware
server.use(restify.plugins.bodyParser());

// protect all routes exept /auth
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] }));

server.listen(config.PORT, () => {
  // get rid of error
  mongoose.set("useFindAndModify", false);
  // connect to mongodb
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;
db.on("error", err => {
  console.log(err);
});

db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/user")(server);
  console.log(`server started on port ${config.PORT}`);
});
