var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/** Importação das rotas para a área "catalog" do site */
const catalogRouter = require("./routes/catalog");
/* Fim da importação das rotas para a área "catalog" do site */

var app = express();

/** Definição da conexão com o MongoDB */ 
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://admin:admin@cluster0.vuwkq.mongodb.net/ContaDeLuz?retryWrites=true&w=majority&appName=Cluster0";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
/* Fim da definição da conexão com o MongoDB */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
/** Adição das rotas de "catalog" ao encadeamento de middleware */
app.use("/catalog", catalogRouter);
/* Fim da adição das rotas de "catalog" ao encadeamento de middleware */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
