import jwt from "jsonwebtoken";
import config from "../config";

const jwtSign = function(data) {
  return jwt.sign(data, config.secret_key, {expiresIn: '6h'});
};

module.exports = {
  jwtSign
};