"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
/**
 * Swagger documentation configuration for the API.
 *
 * This object defines metadata about the API, including the title, description, host URL, and OpenAPI version.
 * It is used by `swagger-autogen` to generate the Swagger specification for the API.
 *
 * @type {SwaggerDoc}
 */
const doc = {
    info: {
        title: 'My API',
        description: 'Description of my API',
    },
    host: 'localhost:5000',
    openapi: '3.0.0',
};
const outputFile = './swagger-output.json';
const routes = ['../routes.ts'];
/**
 * Generates the Swagger documentation for the API.
 *
 * This function uses `swagger-autogen` to automatically generate a Swagger documentation file (`swagger-output.json`)
 * based on the API routes and configuration specified in the `doc` object.
 *
 * @returns {void} This function does not return anything.
 */
(0, swagger_autogen_1.default)()(outputFile, routes, doc);
