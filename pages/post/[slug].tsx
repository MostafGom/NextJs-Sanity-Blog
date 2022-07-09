import { PortableText } from "@portabletext/react"
import { GetStaticPaths } from "next"
import Header from "../../components/Header"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from '../../typings'
// import { helperComponents } from '../../components/helperComponents'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react"

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post
}

function Post({ post }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const [submitted, setSubmitted] = useState(false);
    console.log(post);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log(res);
                setSubmitted(true);
            })
            .catch(err => {
                console.log(err);
                setSubmitted(false);
            })
    }
    return (
        <main>
            <Header />

            <img src={urlFor(post.mainImage).url()!} alt=""
                className="w-full h-52 object-cover"
            />
            <article className="max-w-5xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <h2 className="text-xl mb-2 text-gray-500">{post.excerpt}</h2>

                <div className="flex items-center space-x-2">
                    <img src={urlFor(post.author.image).url()!} alt=""
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <p className="font-extralight">
                        Blog post by <span className="font-bold">{post.author.name}</span>-
                        Published at : {new Date(post._createdAt).toLocaleString()}
                    </p>
                </div>

                <div className="mt-8">
                    <PortableText
                        value={post.body || []}
                    // components={helperComponents}
                    />
                </div>
            </article>

            <hr className="max-w-lg my-5 mx-auto border-yellow-500" />

            {submitted
                ? <div className="flex flex-col bg-yellow-500 text-white py-10 px-5 my-4 mx-auto max-w-2xl">
                    <h3 className="text-3xl">Thank you for commenting!</h3>
                    <h5>it will be live once approved</h5>
                </div>

                : <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">

                    <h3 className="text-2xl font-bold">Leave a comment below</h3>
                    <hr className="mt-2" />
                    <input type="hidden" value={post._id} {...register("_id")} />

                    <label className="block mb-5">
                        <span className="text-grey-700">Name:</span>
                        <input className="block mt-1 form-input px-3 py-2 rounded shadow border w-full ring-yellow-500 outline-none focus:ring" type='text' placeholder="name"
                            {...register("name", { required: true })}
                        />
                    </label>
                    <label className="block mb-5">
                        <span className="text-grey-700">Email:</span>
                        <input className="block mt-1 form-input px-3 py-2 rounded shadow border w-full ring-yellow-500 outline-none focus:ring" type='email' placeholder="email"
                            {...register("email", { required: true })}
                        />
                    </label>
                    <label className="block mb-5">
                        <span className="text-grey-700">Comment:</span>
                        <textarea className="block mt-1 form-textarea outline-none focus:ring px-3 py-2 rounded shadow border w-full ring-yellow-500" rows={8} placeholder="name"
                            {...register("comment", { required: true })}
                        />
                    </label>
                    <div className="flex flex-col p-5">
                        {errors.name && (
                            <span className="text-red-500">name field is required</span>
                        )}
                        {errors.email && (
                            <span className="text-red-500">email field is required</span>
                        )}
                        {errors.comment && (
                            <span className="text-red-500">comment field is required</span>
                        )}
                    </div>

                    <input type="submit" className="bg-yellow-500 hover:bg-yellow-300 shadow text-white rounded py-2 px-4 cursor-pointer font-bold" />
                </form>
            }

            <div className="flex flex-col py-10 my-10 max-w-2xl mx-auto shadow px-4">
                <h3 className="text-2xl font-bold">Comments</h3>
                <hr className="mt-2" />

                {post.comments.map(comment => (
                    <div key={comment._id}>
                        <p className="text-blue-900"> {comment.name} </p>
                        <p> {comment.comment} </p>
                        <hr className="mt-2" />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Post

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
    _id,
    slug{
        current
    }
}`

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params }: any) => {
    const query = `*[ _type == "post" && slug.current == $slug ][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        excerpt,
        mainImage,
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        // revalidate: 120
    }
}