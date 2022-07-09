import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { sanityClient, urlFor } from '../sanity';
import { Post } from '../typings';

interface Props {
  posts: [Post];
}

const Home = ({ posts }: Props) => {
  console.log(posts);

  return (
    <div className="">
      <Head>
        <title>Next Level Headless</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Hero />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6 px-6 max-w-7xl mx-auto'>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer overflow-hidden rounded-lg'>
              <img className='h-72 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out'
                src={urlFor(post.mainImage).url()!} alt="" />
              <div className='flex justify-between p-5'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p>{post.excerpt} by {post.author.name}</p>
                </div>
                <img className='w-12 h-12 rounded-full' src={urlFor(post.author.image).url()!} alt="" />
              </div>

            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Home

export const getServerSideProps = async () => {

  const query = `*[_type == "post"]{
    _id,
    title,
    author->{
      name,
      image
    },
    excerpt,
    mainImage,
    slug,
  }`

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts
    }
  }
}