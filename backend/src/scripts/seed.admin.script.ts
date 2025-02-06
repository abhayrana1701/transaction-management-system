import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../user/user.schema";
import { MongoService } from "../common/services/database.service";
import * as userService from "../user/user.service";
import { generateTokens } from "../common/helper/token.helper";

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB using MongoService
        await MongoService.connect();

        // Read admin details from environment variables
        const adminName = process.env.ADMIN_NAME ;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD!;

        // Check if an admin already exists
        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        // Create a new admin user
        const admin = new UserModel({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: "admin",
        });
        await admin.save();
        // Generate access and refresh tokens
            const { accessToken, refreshToken } = generateTokens({
              _id: admin._id.toString(),
              email: admin.email,
              role: admin.role,
            });
        
            // Store the refresh token in the user's document
            await userService.updateUser(admin._id.toString(), { refreshToken });

        
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

seedAdmin();
