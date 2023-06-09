import fs from 'fs';
import path from 'path';
import Layout from "@/components/Layout"
import Post from "@/components/Post";
import { POSTS_PER_PAGE } from '@/config/index';
import Pagination from '@/components/Pagination';
import { getPosts } from '@/lib/posts';
import CategoryList from '@/components/CategoryList';

export default function BlogPage({ posts, numPages, currentPage, categories }) {
  return (
    <Layout>
      <div className='flex justify-between'>
        <div className='w-3/4 mr-10'>
          <h1 className='text-5xl border-b-4 p-5 font-bold'>
            Blog
          </h1>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {posts.map((post, index) => (
              <Post key={index} post={post}/>
            ))}
          </div>
          
          <Pagination currentPage = {currentPage} numPages= {numPages} />
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
    const numPages = Math.ceil(files.length / POSTS_PER_PAGE);
    let paths = [];
    for(let i = 1; i <= numPages; i++) {
        paths.push({
            params: { page_index: i.toString() }
        })
    }
    return {
        paths,
        fallback: false
    }
}
export async function getStaticProps({ params }) {
  const page = parseInt((params && params.page_index) || 1);
  const files = fs.readdirSync(path.join('src/posts'));
  const posts = getPosts();
  // Get categories forr side bar
  const categories = posts.map(post => post.frontMatter.category);
  const uniqueCategories = [...new Set(categories)];
  console.log(uniqueCategories);
  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);
  const PageIndex = page - 1;
  const sortedPosts = posts.slice(PageIndex * POSTS_PER_PAGE, (PageIndex + 1) * POSTS_PER_PAGE);
  return {
    props: {
      posts: sortedPosts,
      numPages,
      currentPage: page,
      categories: uniqueCategories,
    } 
  }
}