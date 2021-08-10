require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointFiles = [
    './docs/endpoints/anime.js',
    './docs/endpoints/film.js',
    './docs/endpoints/forecast.js',
    './docs/endpoints/religion/religion.js',
    './docs/endpoints/religion/muslim.js',
    './docs/endpoints/social.js',
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
            name: 'Anime',
            description: 'Anime endpoint',
        },
        {
            name: 'Film',
            description: 'Film endpoint',
        },
        {
            name: 'Forecast',
            description: 'Forecast endpoint',
        },
        {
            name: 'Religion',
            description: 'Religion endpoint',
        },
        {
            name: 'Religion / Muslim',
            description: 'Muslim endpoint',
        },
        {
            name: 'Social',
            description: 'Social endpoint',
        },
        {
            name: 'Other',
            description: 'Other endpoint',
        },
    ],
};

swaggerAutogen(outputFile, endpointFiles, doc);
