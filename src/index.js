import "@babel/polyfill";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";

import ecommerce from"./routes/ecommerce";
import user from"./routes/user";

const app = express();
const port = process.env.PORT || 8080;

import "./auth/auth";

import db from "./db/models";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/ecommerce', passport.authenticate("jwt", {session: false}), ecommerce);
app.use('/user', user);
db.sequelize.sync().then(() => {
    app.listen(port, function () {
        console.log(`Example app listening on port ${port}!`);
    });
});