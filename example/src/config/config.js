module.exports = {
  // API Gateway
  api: {
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.SERVERPORT || 7000}`
  }
};
