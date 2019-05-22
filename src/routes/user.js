import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { User } from "../db/models";
import config from "../config";
import helpers from "../helpers/helpers";

const router = express.Router();

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, config.bcrypt.saltRounds, (err, hash) => {
    User.create({
      email: req.body.email,
      password: hash
    }).then((user) => {
      res.json(user);
    });
  });
});

router.post('/signin/local', (req, res) => {
  User.findOne({
    where: {
      email: req.body.login,
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
    res.status(400).send("User with this name does not exist");
  })

});


router.get('/signin/google', passport.authenticate("google", {scope: ["profile", "email"]}));

router.get('/signin/google/callback', passport.authenticate("google", {failureRedirect: "/login", session: false}),
  function (req, res) {
    let token = req.user.token;
    res.redirect(config.hostUI + ":" + config.portUI + "/#/login?token=" + token);
  }
  );

router.get('/signin/microsoft', passport.authenticate("microsoft", {scope: ["openid", "https://graph.microsoft.com/user.read", "email"]}));

router.get('/signin/microsoft/callback', passport.authenticate("microsoft", {failureRedirect: "/login", session: false}),
  function (req, res) {
    let token = req.user.token;
    res.redirect(config.hostUI + ":" + config.portUI + "/#/login?token=" + token);
  }
);

module.exports = router;