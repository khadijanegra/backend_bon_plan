const express = require('express');
const app = express();
const User = require('../models/user');

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3002, function () {
  console.log('Server listening on port 3002');
});