import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { User } from "../db/models";
import config from "../config";
import helpers from "../helpers/helpers";

const router = express.Router();

router.post('/signup', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        if (user) {
            res.status(400).send("User with this email is already exists");
        } else {
            bcrypt.hash(req.body.password, config.bcrypt.saltRounds, (err, hash) => {
                User.create({
                    email: req.body.email,
                    password: hash
                }).then((user) => {
                    res.json(user);
                });
            });
        }
    }).catch((err) => {
        res.status(err.statusCode).send(err.message);
    })
});

router.post('/signin/local', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    }
  }).then(user => {
    bcrypt.compare(req.body.password, user.password).then((equal) => {
      if (equal) {
        const body = {
          id: user.id,
          email: user.email
        };
        const token = helpers.jwtSign({user: body});
        res.json({
          user,
          success: true,
          token
        })
      } else {
        res.status(400).send("Wrong password");
      }
    });
  }).catch(() => {
    res.status(400).send("User with this email does not exist");
  })

});


router.get('/signin/google', (req, res, next) => {
    passport.authenticate("google", {scope: ["profile", "email"], state: req.query.app})(req, res, next);
});

router.get('/signin/google/callback', passport.authenticate("google", {failureRedirect: "/login", session: false}),
  function (req, res) {
    let token = req.user.token;
    res.redirect(config.hostUI + `${config.portUI ? `:${config.portUI}` : ``}` + `${req.query.state ? `/${req.query.state}` : ``}` + "/#/login?token=" + token);
  }
  );

router.get('/signin/microsoft', (req, res, next) => {
    passport.authenticate("microsoft", {scope: ["https://graph.microsoft.com/user.read openid"], state: req.query.app})(req, res, next);
});

router.get('/signin/microsoft/callback', passport.authenticate("microsoft", {failureRedirect: "/login", session: false}),
  function (req, res) {
    let token = req.user.token;
    res.redirect(config.hostUI + `${config.portUI ? `:${config.portUI}` : ``}` + `${req.query.state ? `/${req.query.state}` : ``}` + "/#/login?token=" + token);
  }
);

module.exports = router;