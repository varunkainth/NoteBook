import User from "../models/User.js";
import TokenGen from "../utils/TokenGen.js";
import uploadFile from "../utils/uploadToCloudinary.js";
import bcrypt from "bcryptjs"

export const AuthRegister = async (req, res) => {
  try {
    // Destructure request body
    const { email, password, name, dob, phoneNumber, gender } = req.body;
    console.log({

      name,
      email,
      password,
      dob,
      phoneNumber,
      gender
    })

    // Validate input fields
    if (!email || !password || !name || !dob || !phoneNumber || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered." });
    }

    // Create new user
    const newUser = new User({
      email,
      name,
      password,
      DateOfBirth: dob,
      gender,
      phoneNumber,
    });

    // Save user to database
    const user = await newUser.save();

    // Handle profile picture upload if provided
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
        // Handle error or proceed without updating profilePic
      }
    }

    // Update user with profile picture URL if uploaded
    if (profilePicUrl) {
      user.profilePic = profilePicUrl;
      await user.save(); // Only save if profilePic was updated
    }

    // Generate token
    const token = await TokenGen(user._id);

    // Set authentication token in cookies
    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
      secure: true,
    });

    // Set authorization header
    res.header("Authorization", `Bearer ${token}`);

    // Respond with success
    return res.status(201).json({
      message: "User created successfully.",
      token,
      user: {
        ...user.toObject(),
        password: undefined, // Exclude password from response
      },
    });
  } catch (err) {
    console.error("Auth Register Error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const AuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email }).select("+password"); // Include password for comparison
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = await TokenGen(user._id);
    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.header("Authorization", `Bearer ${token}`);
    const userWithNotes = await User.findById(user._id)
      .select("-password")
      .populate("notes");

    return res.status(200).json({
      message: "User logged in successfully.",
      user: userWithNotes,
      token,
    });
  } catch (err) {
    console.error("Auth Login Error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const AuthLogout = async (req, res) => {
  try {
    res.clearCookie("Token");
    return res.status(200).json({ message: "User logged out successfully." });
  } catch (err) {
    console.error("Auth Logout Error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

