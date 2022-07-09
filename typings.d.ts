export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: {
        name: string;
        image: string;
    };
    comments: Comment[];
    excerpt: string;
    mainImage: {
        asset: {
            url: string;
        };
    }
    slug: {
        current: string;
    };
    body: [object];
}

export interface Comment {
    approved: boolean;
    comment: string;
    name: string;
    email: string;
    post: {
        _ref: string;
        _type: string;
    };
    _createdAt: string;
    _updatedAt: string;
    _id: string;
    _type: string;
    _rev: string;
}