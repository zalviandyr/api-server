require('module-alias/register');
require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointFiles = [
    './docs/endpoints/bmkg.js',
    './docs/endpoints/religion.js',
    './docs/endpoints/scrape.js',
    './docs/endpoints/social.js',
    './docs/endpoints/youtube.js',
    './docs/endpoints/other.js',
];

const doc = {
    info: {
        version: '1.0.0',
        title: 'Public API - ZalviandyR',
        description: 'Swagger documentation for My API',
    },
    host: process.env.API_HOST,
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'BMKG',
            description: 'BMKG endpoint',
        },
        {
            name: 'Religion',
            description: 'Religion endpoint',
        },
        {
            name: 'Scrape',
            description: 'Scrape endpoint',
        },
        {
            name: 'Social',
            description: 'Social endpoint',
        },
        {
            name: 'Youtube',
            description: 'Youtube endpoint',
        },
        {
            name: 'Other',
            description: 'Other endpoint',
        },
    ],
};

swaggerAutogen(outputFile, endpointFiles, doc);
