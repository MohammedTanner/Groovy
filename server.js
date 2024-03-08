const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))
const connectDB = require("./db");


// Connecting the Database
connectDB();

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})

app.use("/api/auth", require("./Auth/Route"))