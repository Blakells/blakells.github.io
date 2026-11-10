import { serveDir } from './lib/serve.mjs';

const port = Number(process.env.PORT ?? 4321);
// Lantern Hollow is its own Pages project site; once the domain is live, Pages serves it at /lantern-hollow/.
const { url } = await serveDir('dist', port, { '/lantern-hollow/': 'https://blakells.github.io/lantern-hollow/' });
console.log(`Serving dist/ at ${url}/`);
