require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const uri = process.env.DB_URI;
mongoose.connect(uri, (err) => {
    if (err) return console.log(err);
    console.log("Connected to the db succecssfuly");
})

const noteSchema = mongoose.Schema({
    title: String,
    content: String
})
const Note = mongoose.model("Note", noteSchema);

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.route("/")
    .get((req, res) => {
        Note.find({}, (err, foundNotes) => {
            if (err) {
                console.log(err);
                return res.json({});
            };
            res.json(foundNotes);
        })
    }).post((req, res) => {

        const data = req.body;
        const newNote = new Note({
            title: data.title,
            content: data.content
        });
        newNote.save().then(() => res.json({
            message: "transaction succesfull"
        })).catch(err => res.json({
            message: err.message
        }));
    })

app.listen(PORT, () => console.log(`app is connected to port ${PORT}`));