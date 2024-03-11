const express = require('express');
const { adminAuth, userAuth } = require("./middleware/auth.js");
const app = express();
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))
const connectDB = require("./db");
const cookieParser = require("cookie-parser");


// Connecting the Database
connectDB();

app.use(express.json())
app.use(cookieParser());
app.get("/admin", adminAuth, (req, res) => res.send("admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})

app.use("/api/auth", require("./Auth/Route"))