module.exports = {
    apps: [{
        name: 'Marathon Myanmar Dashboard',
        script: './server/index.js',
        instances: 0,
        exec_mode: 'cluster',
        watch: true,
        env: {
            NODE_ENV: 'production',
            PORT: '8000'
        }
    }]
};