const express = require("express");
const path = require("path");
const db = require("./db.js");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/snippets", (req, res) => {
  const info = db.createSnippet.run(req.body.language, req.body.code);
  const snippet = db.findSnippetById.get(info.lastInsertRowid);
  res.status(201).json(snippet);
});

app.get("/snippets", (req, res) => {
  let snippets;

  if (req.query.lang) {
    snippets = db.findSnippetsByLanguage.all(req.query.lang);
  } else {
    snippets = db.findSnippets.all();
  }

  res.status(200).json(snippets);
});

app.get("/snippets/:id", (req, res) => {
  const snippet = db.findSnippetById.get(req.params.id);

  if (snippet) {
    res.status(200).json(snippet);
  } else {
    res.status(404).json({ error: "Snippet not found" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

