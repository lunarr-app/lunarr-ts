module.exports = {
  apps: [
    {
      name: 'lunarr-server',
      script: 'dist/server.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
