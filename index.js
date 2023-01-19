const app = require("./app")

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is live on ${process.env.SERVER_URI}:${PORT}`);
})