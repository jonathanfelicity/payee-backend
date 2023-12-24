export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  // KEGOW_SECURITY_KEY
  kegow: {
    security_key: process.env.KEGOW_SECURITY_KEY,
    base_uri: process.env.KEGOW_BASE_URI,
  },
});
