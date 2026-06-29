import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SUMS API',
      version: '1.0.0',
      description: 'API REST para el Sistema Unificado de Manejo de Salud (SUMS)',
    },
    servers: [
      {
        url: 'https://sums-api.troy.engineer/sums',
        description: 'Production server',
      },
      {
        url: `http://localhost:${process.env.PORT || process.env.API_PORT || 3000}/sums`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './src/Cedula/**/*.ts',
    './src/Catalogos/**/*.ts',
    './src/DatosLaborales/**/*.ts',
    './src/Direccion/**/*.ts',
    './src/Dosis/**/*.ts',
    './src/Entrevistador/**/*.ts',
    './src/Familia/**/*.ts',
    './src/NucleoFamiliar/**/*.ts',
    './src/Persona/**/*.ts',
    './src/PersonaSalud/**/*.ts',
    './src/UnidadSalud/**/*.ts',
    './src/User/**/*.ts',
    './src/Vacunacion/**/*.ts',
    './src/Vacunas/**/*.ts',
    './src/Vivienda/**/*.ts',
    './src/EstadisticasOperacion/**/*.ts',
    './src/EstadisticasDemografia/**/*.ts',
    './src/EstadisticasSalud/**/*.ts',
    './src/EstadisticasVivienda/**/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
