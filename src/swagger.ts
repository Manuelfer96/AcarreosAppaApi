// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerSchemas from "./swaggerSchemas";

const { cliente, cuidador, acarreo, admin, bisonte } = swaggerSchemas;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de AcarreosAppa",
      version: "1.0.0",
      description: "Documentación de la API de AcarreosAppa",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL base de tu API
        description: "Servidor local",
      },
      {
        url: "https://acarreosappaapi.onrender.com", // URL base de tu API
        description: "Servidor producción",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Cliente: cliente,
        Cuidador: cuidador,
        Acarreo: acarreo,
        Admin: admin,
        Bisonte: bisonte,
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Ruta a los archivos que contienen las rutas y comentarios de Swagger
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
