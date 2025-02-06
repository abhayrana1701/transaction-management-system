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
exports.getAllCommissionsController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const commission_service_1 = require("./commission.service");
const response_helper_1 = require("../common/helper/response.helper");
/**
 * Controller to retrieve all commission details.
 * This route is intended for admin users.
 */
exports.getAllCommissionsController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Optionally, you may check if req.user has admin role, but typically the middleware handles that.
    const commissions = yield (0, commission_service_1.getAllCommissionsService)();
    res.status(200).send((0, response_helper_1.createResponse)({ commissions }, "Commission details retrieved successfully"));
}));
