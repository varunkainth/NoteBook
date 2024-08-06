import cloudinary from "../config/cloudinary.js";

const uploadFile = async (
  userId,
  noteId,
  noteTitle,
  filePath,
  isProfilePic = false
) => {
  // Create folder paths based on whether it's a profile picture or not
  const folder = isProfilePic
    ? `NotesApp/users/${userId}/profilePic`
    : `NotesApp/users/${userId}/notes/${noteId || noteTitle}`;

  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folder,
    });

    return result;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

export default uploadFile;
