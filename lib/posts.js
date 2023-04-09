import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortByDate } from '@/utils/index';

const files = fs.readdirSync(path.join('src/posts'));
export function getPosts() {
    const posts = files.map(filename => {
        const slug = filename.replace('.md', '');
        const markDownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8');
        const {data: frontMatter} = matter(markDownWithMeta); // rename data to frontMatter
        return {
          slug,
          frontMatter,
        }
    });

    return posts.sort(sortByDate);
}