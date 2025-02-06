"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv_1 = __importDefault(require("dotenv"));
const user_schema_1 = __importDefault(require("../user/user.schema"));
const database_service_1 = require("../common/services/database.service");
const userService = __importStar(require("../user/user.service"));
const token_helper_1 = require("../common/helper/token.helper");
dotenv_1.default.config();
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB using MongoService
        yield database_service_1.MongoService.connect();
        // Read admin details from environment variables
        const adminName = process.env.ADMIN_NAME;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        // Check if an admin already exists
        const existingAdmin = yield user_schema_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }
        // Create a new admin user
        const admin = new user_schema_1.default({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: "admin",
        });
        yield admin.save();
        // Generate access and refresh tokens
        const { accessToken, refreshToken } = (0, token_helper_1.generateTokens)({
            _id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        });
        // Store the refresh token in the user's document
        yield userService.updateUser(admin._id.toString(), { refreshToken });
        console.log("Admin user created successfully");
    }
    catch (error) {
        console.error("Seeding failed:", error);
    }
});
seedAdmin();
