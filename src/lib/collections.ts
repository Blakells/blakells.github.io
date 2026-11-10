import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type EarlierProject = CollectionEntry<'earlier'>;
export type Post = CollectionEntry<'posts'>;

export async function featuredProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}

export async function earlierWork(): Promise<EarlierProject[]> {
  return (await getCollection('earlier')).sort((a, b) => a.data.order - b.data.order);
}

/** Published posts, newest first. */
export async function publishedPosts(): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const projectHref = (id: string) => `/work/${id}/`;
export const postHref = (id: string) => `/writing/${id}/`;
/** "01", "02", … for channel labels. */
export const channel = (index: number) => String(index + 1).padStart(2, '0');
