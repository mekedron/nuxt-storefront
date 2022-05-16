import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ssl: false,
  secure: false,
  ws: false,
});

export default function (req, res, next) {
  if (
    !process.env.STOREFRONT_GRAPHQL_BACKEND_URL_PROXY ||
    !req.url.startsWith(process.env.STOREFRONT_GRAPHQL_BACKEND_PATH)
  ) {
    return next();
  }

  try {
    proxy.web(req, res, {
      target: process.env.STOREFRONT_GRAPHQL_BACKEND_URL_PROXY,
    });
  } catch (err) {
    console.error(err);
    next();
  }
}
