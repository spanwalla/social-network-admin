import express from "express";
import logger from "morgan";
import path from "path";
import dotenv from "dotenv";
import createHttpError from "http-errors";
import {existsSync, mkdirSync} from "fs";
import cors from 'cors';

// routers
import indexRoutes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import feedRoutes from "./routes/feed.js";
import apiRoutes from "./routes/api.js";

dotenv.config();

if (!existsSync(path.join(import.meta.dirname, process.env.DB_DIRNAME))) {
    mkdirSync(path.join(import.meta.dirname, process.env.DB_DIRNAME));
}

if (!existsSync(path.join(import.meta.dirname, 'uploads'))) {
    mkdirSync(path.join(import.meta.dirname, 'uploads', 'images'));
}

const app = express();

// views engine setup
app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(import.meta.dirname, 'public', process.env.BUILD)));
app.use('/fontawesome', express.static(path.join(import.meta.dirname, 'public', 'fontawesome')));
app.use('/uploads', express.static(path.join(import.meta.dirname, 'uploads')));

app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);
app.use("/api", apiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createHttpError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res["locals"].message = err["message"];
    res["locals"].error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err["status"] || 500);
    return res.render('error', {error: err});
});

export default app