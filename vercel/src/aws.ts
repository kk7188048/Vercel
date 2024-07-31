import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

// replace with your own credentials
const s3 = new S3({
    accessKeyId: "AKIAQ3EGRWEITPASIQWF",
    secretAccessKey: "lJsAo3alBVOxj0Wgx6LfBSzWY+vPvw4ggnbmpvFH"
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Bucket: "vercel13",
        Key: '' + path.basename(fileName),
        Body: fileContent,
    }).promise();
    console.log(response);
}