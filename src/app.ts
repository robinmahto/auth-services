import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(JSON.stringify({ message: "Welcome to the Auth services" }));
});

export default app;
