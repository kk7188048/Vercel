"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllFiles = (folderPath) => {
    let response = [];
    // Check if the directory exists
    console.log(`Checking if folder exists: ${folderPath}`);
    if (!fs_1.default.existsSync(folderPath)) {
        console.log(`Directory does not exist. Creating: ${folderPath}`);
        fs_1.default.mkdirSync(folderPath, { recursive: true }); // Create the directory if it doesn't exist
    }
    else {
        console.log(`Directory exists: ${folderPath}`);
    }
    // Read the contents of the directory
    console.log(`Reading contents of directory: ${folderPath}`);
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    console.log(`Contents of ${folderPath}:`, allFilesAndFolders);
    // Process each file and folder
    allFilesAndFolders.forEach(file => {
        console.log(`Processing file/folder: ${file}`);
        const fullFilePath = path_1.default.join(folderPath, file);
        console.log(`Full file path: ${fullFilePath}`);
        // Check if the path is a directory
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            console.log(`It's a directory. Recursively getting files from: ${fullFilePath}`);
            response = response.concat((0, exports.getAllFiles)(fullFilePath));
        }
        else {
            console.log(`It's a file. Adding to response: ${fullFilePath}`);
            response.push(fullFilePath);
        }
    });
    console.log(`Final contents of ${folderPath}:`, response);
    return response;
};
exports.getAllFiles = getAllFiles;
