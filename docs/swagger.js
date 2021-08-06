require('module-alias/register')
require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger-output.json'
const endpointFiles = ['./docs/endpoints/bmkg.js']

const doc = {
    info: {
        version: '1.0.0',
        title: 'Public API - ZalviandyR',
        description: 'Swagger documentation for My API',
    },
    host: process.env.API_HOST,
    basePath: '/api',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'BMKG',
            description: 'BMKG endpoint',
        },
    ],
}

swaggerAutogen(outputFile, endpointFiles, doc)
