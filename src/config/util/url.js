const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env === "dev"
    ? "mongodb://localhost:27017/dashboard_realtime"
    : env === "prod"
    ? "mongodb://heroku_wmt175dj:aihk8kenne0u2qmag6vi4v5n2o@ds061298.mlab.com:61298/heroku_wmt175dj"
    : "mongodb://socketio_dashboard-mongo:27017/dashboard_realtime";
