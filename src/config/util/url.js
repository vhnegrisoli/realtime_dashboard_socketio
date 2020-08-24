const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env === "dev"
    ? "mongodb://localhost:27017/dashboard_realtime"
    : "mongodb://socketio_dashboard-mongo:27017/dashboard_realtime";
