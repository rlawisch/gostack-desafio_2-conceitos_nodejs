const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.status(201).send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send({ error: "Repository not found" });
  }

  const repository = {
    ...repositories[repositoryIndex],
    title: title,
    url: url,
    techs: techs,
  };

  repositories[repositoryIndex] = repository;

  return response.send(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes++;
  return response.send(repositories[repositoryIndex]);
});

module.exports = app;
