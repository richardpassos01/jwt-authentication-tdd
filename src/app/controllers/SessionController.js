const {
  User
} = require('../models');

class SessionControler {
  async store(req, res) {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        message: 'E-mail or password wrong!'
      });
    }

    return res.json({
      user,
      token: user.genareteToken()
    });
  }
}

module.exports = new SessionControler();