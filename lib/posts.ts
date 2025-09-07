import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/stories');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  galleryImages: string[]; // 新增字段
  content: string;
  contentHtml: string;
}

/**
 * Fetches and sorts all post data from the filesystem.
 *
 * This function reads all .mdx files from the content/stories directory,
 * parses the front matter, and returns a sorted list of post data.
 *
 * @returns {Omit<PostData, 'content' | 'contentHtml'>[]} A sorted array of post data without content.
 */
export function getSortedPostsData(): Omit<PostData, 'content' | 'contentHtml'>[] {
  // Get file names under /content/stories
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...(matterResult.data as { title: string; date: string; description: string; coverImage: string }),
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Gets all post slugs for static generation.
 *
 * This function reads all file names in the posts directory
 * and returns them as an array of objects with `slug`.
 *
 * @returns {{ slug: string }[]} An array of slugs for `generateStaticParams`.
 */
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.mdx$/, ''),
    };
  });
}

/**
 * Gets the data for a single post by slug.
 *
 * This function reads the mdx file for a given slug, parses the front matter,
 * and converts the markdown content to HTML.
 *
 * @param {string} slug - The slug of the post to retrieve.
 * @returns {Promise<PostData>} A promise that resolves to the post data.
 */
export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the slug and contentHtml
  return {
    slug,
    contentHtml,
    ...(matterResult.data as { 
      title: string; 
      date: string; 
      description: string; 
      coverImage: string; 
      galleryImages: string[]; // 确保类型正确
      content: string; 
    }),
  };
}