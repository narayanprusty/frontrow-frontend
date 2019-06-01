module.exports = {
  // API Gateway
  api: {
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://10.10.6.83:${process.env.SERVERPORT || 7000}`
  }
};
