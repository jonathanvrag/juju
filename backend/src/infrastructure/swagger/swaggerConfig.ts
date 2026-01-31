import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description:
        'RESTful API for managing books, reservations, and loans in a library system',
      contact: {
        name: 'API Support',
        email: 'jonathan.vra@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://jujubackend.jonathanvera.dev',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            title: { type: 'string', example: 'Clean Code' },
            author: { type: 'string', example: 'Robert C. Martin' },
            isbn: { type: 'string', example: '978-0132350884' },
            publishedYear: { type: 'integer', example: 2008 },
            genre: { type: 'string', example: 'Technology' },
            status: {
              type: 'string',
              enum: ['available', 'reserved', 'loaned'],
              example: 'available',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            bookId: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            userId: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            reservationDate: { type: 'string', format: 'date-time' },
            expirationDate: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['active', 'cancelled', 'expired', 'fulfilled'],
              example: 'active',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Loan: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            bookId: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            userId: { type: 'string', example: '679d4680452aaa6de8fdf1ae' },
            loanDate: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            returnDate: { type: 'string', format: 'date-time', nullable: true },
            status: {
              type: 'string',
              enum: ['active', 'returned', 'overdue'],
              example: 'active',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Resource not found' },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./src/interfaces/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
