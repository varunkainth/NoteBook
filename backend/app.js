import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

// Express MiddleWare
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer specific errors
    res.status(400).send(err.message);
  } else {
    // Other errors
    res.status(500).send('Internal Server Error');
  }
});


// Routes
import AUTHROUTES from "./routes/Auth.js";
import USERROUTES from "./routes/User.js";
import NOTESROUTES from "./routes/Note.js";
import multer from "multer";

app.use("/api/auth", AUTHROUTES);
app.use("/api/users", USERROUTES);
app.use("/api/notes/", NOTESROUTES);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the NOTEBOOK API ");
});

export default app;
