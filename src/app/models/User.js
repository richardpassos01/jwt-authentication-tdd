const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    password_hash: DataTypes.STRING
  }, {
    hooks: {
      beforeSave: async user => {
        if (user.password) {
          const hash = await bcrypt.hash(user.password, 8);

          Object.assign(user, {
            password_hash: hash
          });
        }
        if (!user.password) {
          throw ({
            message: 'Invalid argument'
          });
        }
      }
    }
  });

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.genareteToken = function () {
    return jwt.sign({
      id: this.id
    }, process.env.APP_SECRET, {
      expiresIn: '1h'
    });
  };

  return User;
};