const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Database connected Successfully.")
}).catch((err) => {
    console.log(`Database can't be connected due to following reason: ${err.message}`)
})