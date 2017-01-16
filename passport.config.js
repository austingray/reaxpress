const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const knex = require('knex')(require('./.knex/knexfile')[process.env.NODE_ENV]);

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    knex.raw(`
      SELECT u.*
      FROM users u
      WHERE u.id = ${id}
    `).then((user) => {
      done(null, user.rows[0]);
    });
  });
  passport.use(new LocalStrategy((username, password, done) => {
    knex.raw(`
      SELECT u.*
      FROM users u
      WHERE u.username = '${username}'
    `).then((user) => {
      if (user.rows.length === 0) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return bcrypt.compare(password, user.rows[0].hash, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res) {
          return done(null, user.rows[0]);
        }
        return done(null, false, { message: 'Incorrect username or password.' });
      });
    });
  }));
};
