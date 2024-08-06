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

// Routes

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the NOTEBOOK API ");
});

export default app;
