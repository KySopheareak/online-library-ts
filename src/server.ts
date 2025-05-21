import express from "express";
import http from "http";
import errorHandlers from "./middleware/error-handlers";
import { applyMiddleware, applyRoutes } from "./middleware/handlers";
import middleware from "./middleware/index";
import * as models from "./models/index.model";
import bookListRoute from "./routes/book-list.route";
import categoryRoute from "./routes/category.route";
import fileRoute from "./routes/file.route";

// mongoose.set('debug', true);

const app = express();

app.use(express.static("views"));
app.use(express.static("public"));
app.set("view engine", "ejs");

//NOTE Extend Express Request as global
declare global {
  namespace Express {
    interface Request {
      context?: any;
      loginUser?: any;
      decoded?: any;
      // files?: any
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[]
        | undefined;
      token?: any;
    }
  }
  interface Error {
    status: string;
  }
}

applyMiddleware(middleware, app);

applyRoutes("/api", bookListRoute, app);
applyRoutes("/api", categoryRoute, app);
applyRoutes("/api", fileRoute, app);

applyMiddleware(errorHandlers, app);

const { PORT = 30005 } = process.env;
const server = http.createServer(app);
server.setTimeout(0);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);

models.connect();
