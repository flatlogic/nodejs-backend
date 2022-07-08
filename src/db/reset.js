const db = require('./models');
const { execSync } = require('child_process');

console.log('Resetting Database');

db.sequelize
  .sync({ force: true })
  .then(() => {
    execSync('sequelize db:seed:all');
    console.log('OK');
    process.exit();
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
