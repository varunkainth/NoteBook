import User from "../models/User.js";
import uploadFile from "../utils/uploadToCloudinary.js";

export const getUpdateDetails = async (req, res) => {
  try {
    const { name, email, dob, gender, password, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (dob) user.DateOfBirth = dob;
    if (gender) user.gender = gender;
    if (password) user.password = password;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log("User Details Update Error", console.err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Delete User Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUpdateProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let profilePicUrl;
    if (req.file?.path) {
      try {
        const result = await uploadFile(
          user._id,
          null,
          null,
          req.file.path,
          true
        );
        profilePicUrl = result.url;
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
      }
    }
    if (profilePicUrl) {
      user.profilePic = profilePicUrl;
      await user.save();
    }
    res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    console.log(" Profile Pic Update Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};