import { serveDir } from './lib/serve.mjs';

const port = Number(process.env.PORT ?? 4321);
// The games are their own Pages project sites; Pages serves them at /lantern-hollow/ and /tidewood-isle/.
const { url } = await serveDir('dist', port, {
  '/lantern-hollow/': 'https://blakells.github.io/lantern-hollow/',
  '/tidewood-isle/': 'https://blakells.github.io/tidewood-isle/',
});
console.log(`Serving dist/ at ${url}/`);
