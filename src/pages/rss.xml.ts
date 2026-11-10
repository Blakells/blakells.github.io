import rss from '@astrojs/rss';
import { postHref, publishedPosts } from '../lib/collections';
import { site } from '../lib/site';

export async function GET() {
  const posts = await publishedPosts();
  return rss({
    title: `${site.name}: Writing`,
    description: 'Posts by Blake Bailey on building AI agents that are safe to run, and on testing them.',
    site: site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post.id),
    })),
  });
}
