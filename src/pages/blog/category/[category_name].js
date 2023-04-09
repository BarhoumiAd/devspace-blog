import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from "@/components/Layout"
import Post from "@/components/Post";
import { getPosts } from '@/lib/posts';
import CategoryList from '@/components/CategoryList';
export default function CategoryBlogPage({ posts, categoryName, categories }) {
  return (
    <Layout>

        <div className='flex justify-between'>
            <div className='w-3/4 mr-10'>
                <h1 className='text-5xl border-b-4 p-5 font-bold'>Posts in {categoryName}</h1>

                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {posts.map((post, index) => (
                    <Post key={index} post={post}/>
                    ))}
                </div>
            
            </div>

            <div className='w-1/4'>
                <CategoryList categories={categories} />
            </div>
        </div>
    </Layout>
  )
}

export async function getStaticPaths() {
    const files = fs.readdirSync(path.join('src/posts'));
    const categories = files.map(filename => {
        const markDownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8');
        const {data:frontMatter} = matter(markDownWithMeta);

        return frontMatter.category.toLowerCase();
    });
    const paths = categories.map(category => ({
        params: {
            category_name: category
        }
    }));
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params: {category_name}}) {
  const posts = getPosts();
  // Get categories forr side bar
  const categories = posts.map(post => post.frontMatter.category);
  const uniqueCategories = [...new Set(categories)];
  // filter by category posts
  const categoryPosts = posts.filter(post => post.frontMatter.category.toLowerCase() === category_name);
  return {
    props: {
      posts: categoryPosts,
      categoryName: category_name,
      categories: uniqueCategories,
    } 
  }
}   