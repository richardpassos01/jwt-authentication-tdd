const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('../src/app/middleware/auth');
const {
  User
} = require('./app/models');

routes.post('/createUser', async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    await User.create({
      name,
      email,
      password
    });

    return res.status(200).json({
      message: 'User created successfully'
    });
  } catch (err) {
    console.log('ERROR:', JSON.stringify(err));
    return res.status(401).json({
      message: 'User not created'
    });
  }
});

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/dashboard', (req, res) => {
  return res.status(200).json({
    message: 'token valid'
  });
});

module.exports = routes;