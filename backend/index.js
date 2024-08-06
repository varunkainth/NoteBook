import app from "./app.js";
import DB_Connect from "./config/Database.js";
import dotenv from "dotenv";

dotenv.config({});

const Port = process.env.PORT || 3000;

await DB_Connect()
  .then(() => {
    console.log("Database Connected");
    app.listen(Port, async () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((Err) => {
    console.log("Index File Mognoose Connection Error: ", Err);
    process.exit(1)
  });
