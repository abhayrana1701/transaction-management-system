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
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger/swagger-output.json"));
const database_service_1 = require("./common/services/database.service");
const config_helper_1 = require("./common/helper/config.helper");
const error_handler_middleware_1 = __importDefault(require("./common/middleware/error-handler.middleware"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Load environment variables and configurations
(0, config_helper_1.loadConfig)();
// Application port defined in environment variables
const port = Number(process.env.PORT);
// Create an Express application instance
const app = (0, express_1.default)();
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
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
//app.use(applyRateLimiter);
app.use(error_handler_middleware_1.default);
// Swagger UI for API documentation at /api-docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
// Enable CORS for requests from localhost:5173 with credentials and specific methods
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
/**
 * Start the server, connect to MongoDB, and define routes
 * @returns {Promise<void>} A promise that resolves once the server starts.
 */
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to MongoDB using MongoService
    yield database_service_1.MongoService.connect();
    // Use the /api route for the main application routes
    app.use("/api", routes_1.default);
    // Basic health check route to confirm the server is running
    app.get("/", (req, res) => {
        res.send({ status: "ok" });
    });
    // Start the server on the specified port
    http_1.default.createServer(app).listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
// Initialize the server startup
void startServer();
