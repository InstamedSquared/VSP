const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    // Grab the URL from .env, or use a fallback
    let targetUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

    // Automatically fix the Node 17+ localhost IPv6 issue
    targetUrl = targetUrl.replace('localhost', '127.0.0.1');
    app.use(
        ['/api', '/images', '/auth'],
        createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
        })
    );
};