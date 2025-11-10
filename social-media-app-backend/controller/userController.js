import User from "../models/User.js";
import Post from "../models/Post.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("getUserProfile istek geldi", userId);

    const user = await User.findById(userId)
      .populate("followers", "_id")
      .populate("following", "_id");

    const posts = await Post.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postsCount: posts.length,
      posts: posts.map((p) => ({
        id: p._id,
        image: p.image,
        createdAt: p.createdAt,
        likesCount: p.likes.length,
        likes: p.likes.map((like) => ({
          userId: like.userId,
          likedAt: like.likedAt,
        })),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const editUserProfile = async (req, res) =>{
  try {
    // const userId = req.params.id;
    const userId = req.user.id;
    console.log("editUserProfile e girdi");

    console.log("req body", req.body);
    console.log("req file", req.file);

    const { username } = req.body;
    const file = req.file;
    
    console.log("file", file);
    console.log("username", username);

    let updatedFields = {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username !== undefined && username.trim() !== "") {
      updatedFields.username = username;
    }

    if (file) {
      const imagePath = `/uploads/${file.filename}`;
      updatedFields.profilePicture = imagePath;
    }

    console.log("updatedFields", updatedFields);

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    console.log("updatedUser", updatedUser);

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}