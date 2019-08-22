const express = require('express');

const server = express();
server.use(express.json());

// Query Params = ? test=1
// Route params = /users/1
// Request body = { "name": "Leonardo" }

const users = ['Leo', 'Miriam', 'Julia'];

server.use((req, res, next) => {
  console.log('accessing...');
  next();
});

server.get('/users/:id', (req, res) => {
  //const name = req.query.name;
  const id = req.params.id;
  return res.json({ message: users[id] });
});

server.get('/users', (req, res) => {
  res.json(users);
});

server.post('/users', (req, res) => {
  const { name } = req.body;
  users.push(name);
  res.json(users);
});

server.put('/users/:index', (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

server.delete('/users/:index', (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
