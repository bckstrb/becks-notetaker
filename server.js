const express = require("express");
const path = require("path");
const store = require("./db/store");

const PORT = process.env.PORT || 3001;

const app = express();

//middleware for parsing the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//making the public files static
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  store
    .getAllNotes()
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => res.status(500).json(err));
});

app.post("/api/notes", (req, res) => {
  store
    .postNote(req.body)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/notes/:id", (req, res) => {
  store
    .deleteNote(req.params.id)
    .then(() => res.json({ ok: `deleted note ${req.params.id}` }))
    .catch((err) => res.status(500).json(err));
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
