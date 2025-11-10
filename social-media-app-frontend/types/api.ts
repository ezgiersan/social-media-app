export type Post = {
    id: string;
    image: string;
    likesCount: number;
    likes: Like[];
    username?: string;
    createdAt?: string;
};

export type User = {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    posts: Post[];
};

export type Like = {
    userId: string;
    likedAt: Date;
  };