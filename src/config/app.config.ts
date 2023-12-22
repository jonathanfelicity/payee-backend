export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
  },
});
