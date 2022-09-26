require('dotenv').config();

module.exports = ({
    PORT: process.env.DEV_PORT,
    HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DATABASE: process.env.DB_NAME,
    DB_USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD,
    SECRET_SESSION: process.env.SECRET_SESSION
})