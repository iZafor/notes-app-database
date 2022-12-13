require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
// const uri = "mongodb://127.0.0.1:27017/noteDb";
const uri = process.env.DB_URI;
mongoose.connect(uri, (err) => {
    if (err) return console.log(err);
    console.log("Connected to the db succecssfuly");
})

const noteSchema = mongoose.Schema({
    __id: String,
    title: String,
    content: String
})
const Note = mongoose.model("Note", noteSchema);

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    Note.find({}).then(foundNotes => res.json(foundNotes))
        .catch(err => res.json({
            message: err
        }))
})

app.post("/add/one", (req, res) => {
    const data = req.body;
    const newNote = new Note({
        __id: data.__id,
        title: data.title,
        content: data.content
    });
    newNote.save().then(() => res.json({
        message: "transaction succesfull"
    })).catch(err => res.json({
        message: err.message
    }));
})

app.post("/add/many", (req, res) => {
    Note.insertMany(req.body).then(response => {
        res.json({
            message: "transaction successfull"
        })
    }).catch(err => {
        res.json({
            message: err
        })
    })
})

app.delete("/delete/all", (req, res) => {
    Note.deleteMany({}).then(response => {
        res.json({
            message: response
        })
    }).catch(err => {
        res.json({
            message: err
        })
    })
})

app.delete("/delete/:__id", (req, res) => {
    Note.deleteOne({ __id: req.params.__id }).then(response => {
        res.json({
            message: response
        })
    }).catch(err => {
        res.json({
            message: err
        })
    })
})



app.listen(PORT, () => console.log(`app is connected to port ${PORT}`));