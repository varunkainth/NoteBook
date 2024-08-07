import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Helper function to generate profile picture URL
const generateProfilePicURL = (name, gender) => {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const genderType = gender === "male" ? "boy" : "girl";
  return `https://avatar.iran.liara.run/public/${genderType}?username=${username}`;
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    DateOfBirth: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.profilePic) {
    // Check if profilePic is not provided
    if (this.isNew || this.isModified("name") || this.isModified("gender")) {
      this.profilePic = generateProfilePicURL(this.name, this.gender);
    }
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
