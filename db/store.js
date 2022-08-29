const util = require("util");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFileAsync("db/db.json", "utf8");
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getAllNotes() {
    return this.read().then((notes) => {
      // console.log(notes)
      let parsedNotes;
      try {
        parsedNotes = JSON.parse(notes);
      } catch (err) {
        parsedNotes = [];
      }

      return parsedNotes;
    });
  }

  postNote(note) {
    note.id = uuid()
    return this.getAllNotes()
      .then((notes) => [...notes, note])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => note);
  }

  deleteNote(id){
    return this.getAllNotes()
    .then(notes=> notes.filter((note)=> note.id !== id))
    .then(filteredNotes => this.write(filteredNotes))
  }
}

module.exports = new Store();
