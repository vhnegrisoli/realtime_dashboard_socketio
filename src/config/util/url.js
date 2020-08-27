const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env === "dev"
    ? "mongodb://localhost:27017/dashboard_realtime"
    : env === "production"
    ? "mongodb://socketio_dashboard:socketio_dashboard123@ds061298.mlab.com:61298/heroku_wmt175dj"
    : "mongodb://socketio_dashboard-mongo:27017/dashboard_realtime";
