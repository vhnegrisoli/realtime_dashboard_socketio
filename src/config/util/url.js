const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env === "dev"
    ? "mongodb://localhost:27017/dashboard_realtime"
    : env === "prod"
    ? env.MONGODB_URI
    : "mongodb://socketio_dashboard-mongo:27017/dashboard_realtime";
