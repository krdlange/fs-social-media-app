import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";;
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// MIDDLEWARE CONFIGURATIONS 
const __filename = fileURLToPath(import.meta.url); //to grab a file url when using modules so that we can use directory names
const __dirname = path.dirname(__filename); //for using type modules
dotenv.config(); //invoke to use env files
const app = express(); //invoke to use express application
app.use(express.json()) //to invoke use middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); //invokes cross origin resource sharing policies
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); //sets the directory of where we keep assets

// file storage - to save uploaded files on website
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, "public/assets"); //file will be uploaded in this folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
}});

const upload = multer({ storage }); //variable for uploading a file

//ROUTES WITH FILES

//"auth/register" is a route"
//"upload.single("picture")" is a middleware that uploads an image locally on the public/assets folder that's beeing called in storage variable --this needs to run before the endpoint which is the register controller/function
//"register" actual logic of saving a user into a database 
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.user("/posts", postRoutes);

//MONGOOSE CONFIG
const PORT = process.env.PORT || 6001 //if port is not reached, port 6000 is returned

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));