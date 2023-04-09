import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// import posts from '../../../cache/data';
export default function (req, res) {
  let posts;
  if (process.env.NODE_ENV === 'production') {
    // Fetch from cache
    posts = require('../../../cache/data').posts;
  } else {
    const files = fs.readdirSync(path.join('src/posts'));
    posts = files.map(filename => {
      const slug = filename.replace('.md', '');
      const markdownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8');
      const { data: frontMatter } = matter(markdownWithMeta);
      return {
        frontMatter,
        slug,
      }
    });
  }
  const results = posts.filter(
    ({ frontMatter: { title, excerpt, category } }) =>
      title.includes(req.query.q) ||
      excerpt.includes(req.query.q) ||
      category.includes(req.query.q)
  )
  res.status(200).json(results);
}
