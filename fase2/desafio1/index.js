const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let countRequests = 0;

// Server listen message
server.get('/', (req, res) => {
  res.json({ message: 'Server Running' });
});

// *** Middlewares ***
const checkId = (req, res, next) => {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  if (!project) {
    return res.status(400).json({ message: 'Invalid project code' });
  }

  next();
};

const counter = (req, res, next) => {
  countRequests += 1;
  console.log(`Total requests done: ${countRequests}`);
  next();
};

server.use(counter);

// Create a new Project
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });
  res.status(200).json({ message: 'Project saved.' });
});

// List of all projects
server.get('/projects', (req, res) => {
  res.status(200).json(projects);
});

// Update an existing project
server.put('/projects/:id', checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id == id);
  projects[index].title = title;
  res.json(projects);
});

// Delete a specific project
server.delete('/projects/:id', checkId, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id == id);
  if (index > -1) {
    projects.splice(index, 1);
  }

  res.json(projects);
});

// Update tasks from an existing project
server.post('/projects/:id/tasks', checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id == id);
  if (index > -1) {
    projects[index].tasks.push(title);
    res.status(200).json(projects[index]);
  } else {
    res.status(400).json({ message: 'Project not found' });
  }
});

server.listen(3333);
