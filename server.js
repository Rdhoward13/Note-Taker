const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

//GET route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//Get Route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

//GET Route for rendering notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
    console.log("GET METHOD WORKING");
  });
});

//POST Route for creating note
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  var noteId = notes.length + 1;
  if (text && title) {
    const newNote = {
      id: noteId,
      title,
      text,
    };
    notes.push(newNote);
    const jsonNote = JSON.stringify(newNote);
    res.json(notes);
    fs.writeFile("./db/db.json", jsonNote, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("POST METHOD WORKING");
    });
  }
});

// DELETE Route for notes
app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id);
  res.json(true);
});

// Delete note function
const deleteNote = (noteID) => {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (note.id == noteID) {
      notes.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notes)
      );
      break;
    }
  }
};

// app.listen on port 3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
