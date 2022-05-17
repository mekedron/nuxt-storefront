import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ssl: false,
  secure: false,
  ws: false,
});

export default function (req, res, next) {
  const config = useRuntimeConfig();

  if (
    !config.graphqlBackendProxyTo ||
    !req.url.startsWith(config.public.graphqlBackendPath)
  ) {
    return next();
  }

  try {
    proxy.web(req, res, {
      target: config.graphqlBackendProxyTo,
    });
  } catch (err) {
    console.error(err);
    next();
  }
}
