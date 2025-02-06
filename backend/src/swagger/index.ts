import swaggerAutogen from 'swagger-autogen';

interface SwaggerDoc {
  info: {
    title: string;
    description: string;
  };
  host: string;
  openapi: string; 
}

/**
 * Swagger documentation configuration for the API.
 * 
 * This object defines metadata about the API, including the title, description, host URL, and OpenAPI version.
 * It is used by `swagger-autogen` to generate the Swagger specification for the API.
 * 
 * @type {SwaggerDoc}
 */
const doc: SwaggerDoc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:5000',
  openapi: '3.0.0',
};

const outputFile: string = './swagger-output.json';
const routes: string[] = ['../routes.ts'];

/**
 * Generates the Swagger documentation for the API.
 * 
 * This function uses `swagger-autogen` to automatically generate a Swagger documentation file (`swagger-output.json`) 
 * based on the API routes and configuration specified in the `doc` object.
 * 
 * @returns {void} This function does not return anything.
 */
swaggerAutogen()(outputFile, routes, doc);
