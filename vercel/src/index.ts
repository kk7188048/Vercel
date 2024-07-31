import express from "express";
import cors from "cors";
import generate1 from "./utils";
import simpleGit from "simple-git";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import path from "path";
import fs from "fs";
const app = express();
app.use(cors());
app.use(express.json());
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();
const subscriber = createClient()
subscriber.connect();
// POSTMAN
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;


    if (!repoUrl) {
        return res.status(400).json({ error: "repoUrl is required" });
    }

    try {
        const result = await generate1(); // Assuming generate is a function that handles deployment
        await simpleGit().clone(repoUrl, path.join(__dirname, `output/${result}`));
        const files = getAllFiles(path.join(__dirname, `output/${result}`));
        console.log(files);
        files.forEach(async file => {
            await uploadFile(file.slice(__dirname.length + 1), file);
            console.log(`File uploaded: ${file}`);
        })
        publisher.lPush("build-queue", result);
        publisher.hSet("build-queue status uploaded", result, Date.now());

        res.status(200).json({ message: "Deployment started", id: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("build-queue status", id as string);
    res.json({ status: response });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
