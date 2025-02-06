import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger-output.json';
import { MongoService } from "./common/services/database.service";
import { loadConfig } from "./common/helper/config.helper";
import { type IUser } from "./user/user.dto";
import errorHandler from "./common/middleware/error-handler.middleware";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { applyRateLimiter } from "./common/middleware/rate.limiter.middleware";

// Load environment variables and configurations
loadConfig();

// Extend Express's global types for `User` and `Request`
declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      id: string;
      user?: User;
    }
  }
}

// Application port defined in environment variables
const port = Number(process.env.PORT);

// Create an Express application instance
const app: Express = express();

/**
 * Middleware setup
 * - `bodyParser.urlencoded`: Parse URL-encoded data
 * - `bodyParser.json`: Parse incoming JSON requests
 * - `morgan`: HTTP request logger
 * - `cookieParser`: Cookie parser for handling cookies
 * - `applyRateLimiter`: Apply rate limiting middleware
 * - `errorHandler`: Error handling middleware
 * - Swagger API documentation
 * - CORS setup to allow cross-origin requests from localhost
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(applyRateLimiter);
app.use(errorHandler);

// Swagger UI for API documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable CORS for requests from localhost:5173 with credentials and specific methods
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,
  }),
);

/**
 * Start the server, connect to MongoDB, and define routes
 * @returns {Promise<void>} A promise that resolves once the server starts.
 */
const startServer = async (): Promise<void> => {
  
  // Connect to MongoDB using MongoService
  await MongoService.connect();

  // Use the /api route for the main application routes
  app.use("/api", routes);

  // Basic health check route to confirm the server is running
  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // Start the server on the specified port
  http.createServer(app).listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
};

// Initialize the server startup
void startServer();
