import { serveDir } from './lib/serve.mjs';

const port = Number(process.env.PORT ?? 4321);
const { url } = await serveDir('dist', port);
console.log(`Serving dist/ at ${url}/`);
