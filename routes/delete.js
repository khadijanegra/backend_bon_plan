const express = require('express');
const app = express();
const User = require('../models/user');

app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.json({ message: 'User deleted' });
});

app.listen(3004, function () {
  console.log('Server listening on port 3004');
});