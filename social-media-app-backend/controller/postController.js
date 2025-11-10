import Post from "../models/Post.js";
import User from "../models/User.js"

export const createPost = async (req, res) => {
  try {
    const userId = req.body.userId;

    // multer tarafından yüklenen dosyanın bilgisi req.file'da
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newPost = new Post({
      userId: userId,
      image: imagePath,
      likes: [],
      createdAt: new Date(),
    });

    await newPost.save();

    const newPostInfo = await newPost.populate("userId", "username");

    res.status(201).json({
      id: newPostInfo._id,
      image: newPostInfo.image,
      createdAt: newPostInfo.createdAt,
      likesCount: newPostInfo.likes.length,
      likes: newPostInfo.likes.map((like) => ({
        userId: like.userId,
        likedAt: like.likedAt,
      })),
      userId: newPostInfo.userId._id,
      username: newPostInfo.userId.username,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    console.log("getPosts istek geldi");
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    const formattedPosts = posts.map((p) => ({
      id: p._id,
      image: p.image,
      createdAt: p.createdAt,
      likesCount: p.likes.length,
      likes: p.likes.map((like) => ({
        userId: like.userId,
        likedAt: like.likedAt,
      })),
      userId: p.userId.id,
      username: p.userId.username,
    }));

    res.status(201).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate("userId", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((like) => like.userId.equals(userId));
    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likes.push({ userId });
    await post.save();

    console.log("likedpost", post);

    res.status(201).json({
      id: post._id.toString(),
      image: post.image,
      createdAt: post.createdAt,
      likesCount: post.likes.length,
      likes: post.likes.map((like) => ({
        userId: like.userId.toString(),
        likedAt: like.likedAt,
      })),
      userId: post.userId._id.toString(),
      username: post.userId.username,
    });
  } catch (error) {
    console.error("Error like post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate("userId", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Beğeni varsa kaldır
    post.likes = post.likes.filter((like) => !like.userId.equals(userId));
    await post.save();

    res.status(201).json({
      id: post._id.toString(),
      image: post.image,
      createdAt: post.createdAt,
      likesCount: post.likes.length,
      likes: post.likes.map((like) => ({
        userId: like.userId.toString(),
        likedAt: like.likedAt,
      })),
      userId: post.userId._id.toString(),
      username: post.userId.username,
    });
  } catch (error) {
    console.error("Error remove like post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Post var mı
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Kullanıcı bu postun sahibi mi
    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
