const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env == "container"
    ? "mongodb://dashboard_realtime-mongo:27017/dashboard_realtime"
    : "mongodb://localhost:27017/dashboard_realtime";
