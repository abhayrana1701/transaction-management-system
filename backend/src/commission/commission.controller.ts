import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getAllCommissionsService } from "./commission.service";
import { createResponse } from "../common/helper/response.helper";

/**
 * Controller to retrieve all commission details.
 * This route is intended for admin users.
 */
export const getAllCommissionsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Optionally, you may check if req.user has admin role, but typically the middleware handles that.
    const commissions = await getAllCommissionsService();
    res.status(200).send(createResponse({ commissions }, "Commission details retrieved successfully"));
  }
);
