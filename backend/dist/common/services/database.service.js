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
exports.MongoService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * MongoService class to manage MongoDB connection.
 */
class MongoService {
    /**
     * Connects to MongoDB using the connection string from environment variables.
     * Ensures that the connection is only established if not already connected.
     * The 'strictQuery' option is set to false to suppress warnings related to MongoDB query options.
     * @returns {Promise<void>} A promise that resolves when the connection is successfully established, or throws an error if connection fails.
     * @throws {Error} Throws an error if the MongoDB connection fails.
     */
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure connection is not already established
                if (mongoose_1.default.connection.readyState === 0) {
                    console.log('Connecting to MongoDB...');
                    // Set the 'strictQuery' option to false to prevent the warning
                    yield mongoose_1.default.set('strictQuery', false);
                    // Fetch the MongoDB URI from environment variables
                    const mongoURI = process.env.MONGO_URI;
                    if (!mongoURI) {
                        throw new Error("MongoDB URI is missing in environment variables");
                    }
                    // Attempt to connect to MongoDB using the URI from environment variables
                    yield mongoose_1.default.connect(mongoURI, {});
                    console.log('MongoDB Connected');
                }
                else {
                    console.log('MongoDB already connected');
                }
            }
            catch (error) {
                console.error('MongoDB connection error:', error);
                throw new Error('Error connecting to MongoDB');
            }
        });
    }
}
exports.MongoService = MongoService;
