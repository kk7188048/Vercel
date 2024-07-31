"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = __importDefault(require("./utils"));
const simple_git_1 = __importDefault(require("simple-git"));
const file_1 = require("./file");
const aws_1 = require("./aws");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
// POSTMAN
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    if (!repoUrl) {
        return res.status(400).json({ error: "repoUrl is required" });
    }
    try {
        const result = yield (0, utils_1.default)(); // Assuming generate is a function that handles deployment
        yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${result}`));
        const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${result}`));
        console.log(files);
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
            console.log(`File uploaded: ${file}`);
        }));
        publisher.lPush("build-queue", result);
        res.status(200).json({ message: "Deployment started", id: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
