module.exports = {
  apps: [
    {
      name: 'promocode-api',
      script: './dist/server.js',
      watch: ['./dist'],
      env_development: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
