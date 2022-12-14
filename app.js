require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const userModel = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/secrets", (req, res) => {
    res.render("secrets")
})

app.post("/register", (req, res) => {
    const newUser = new userModel({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save((err) => {
        if (!err)
            res.render("secrets")
        else
            console.log(err);
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    userModel.findOne({email: username}, (err, result) => {
        if (!err)
            if (result)
                if (result.password === password)
                    res.render("secrets")
                else
                    res.render("login")
            else
                res.render("register")
        else
            console.log(err);
    })
})

app.listen("3000", (err) => {
    console.log("Server running correctly !");
})