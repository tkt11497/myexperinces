module.exports = {
  apps: [
    {
      name: "Merchant Dashboard",
      script: "./server/index.js",
      instances: 0,
      exec_mode: "cluster",
      watch: true,
      env: {
        NODE_ENV: "production",
        PORT: "9000"
      }
    }
  ]
};
