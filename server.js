const express = require('express');
const { adminAuth, userAuth } = require("./middleware/auth.js");
const app = express();
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))
const connectDB = require("./db");
const cookieParser = require("cookie-parser");


// Connecting the Database
connectDB();

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));
app.get('/', (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"))
app.get("/register", (req, res) => res.render("register"))
app.get("/logout", (req, res) => {
    res.cookie("jwt", "", {maxAge: "1" });
    res.redirect("/");
})

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})

app.use("/api/auth", require("./Auth/Route"))