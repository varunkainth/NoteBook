import Note from "../models/Note.js";
import cloudinary from "../config/cloudinary.js";
import uploadFile from "../utils/uploadToCloudinary.js"; // Assuming you have a utility function for uploading files

export const CreateNote = async (req, res) => {
  try {
    const { title, group, color, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Create the note
    const note = new Note({
      title,
      content,
      userId: req.user._id,
      color: color || undefined,
      group: group || undefined
    });

    // Handle attachments
    if (req.files && req.files.attachments) {
      const attachmentPromises = req.files.attachments.map(async (file) => {
        const result = await uploadFile(file.path); // Upload to Cloudinary
        return {
          type: file.mimetype.split("/")[0], // Get the type (e.g., image, document)
          url: result.url, // Cloudinary URL
          size: file.size // Size of the file
        };
      });

      note.attachments = await Promise.all(attachmentPromises);
    }

    await note.save();

    res.status(201).json({ message: "Note created successfully.", note });
  } catch (err) {
    console.error("Create Note Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });

    if (!notes.length) {
      return res.status(404).json({ message: "No notes found." });
    }

    res.status(200).json({ notes });
  } catch (err) {
    console.error("Get All Notes Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    const { title, content, color, group } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    if (color) note.color = color;
    if (group) note.group = group;

    // Handle attachments
    if (req.files && req.files.attachments) {
      const attachmentPromises = req.files.attachments.map(async (file) => {
        const result = await uploadFile(file.path); // Upload to Cloudinary
        return {
          type: file.mimetype.split("/")[0], // Get the type (e.g., image, document)
          url: result.url, // Cloudinary URL
          size: file.size // Size of the file
        };
      });

      note.attachments = await Promise.all(attachmentPromises);
    }

    await note.save();
    res.status(200).json({ message: "Note updated successfully.", note });
  } catch (err) {
    console.error("Update Note Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Optionally, delete attachments from Cloudinary if needed

    res.status(200).json({ message: "Note deleted successfully." });
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const removeAttachment = async (req, res) => {
  try {
    const { noteId, attachmentId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Find the attachment to remove
    const attachmentIndex = note.attachments.findIndex(att => att._id.toString() === attachmentId);
    if (attachmentIndex === -1) {
      return res.status(404).json({ message: "Attachment not found." });
    }

    // Remove the attachment from the note's attachments array
    const [removedAttachment] = note.attachments.splice(attachmentIndex, 1);

    // Delete the attachment from Cloudinary
    if (removedAttachment.url) {
      const publicId = removedAttachment.url.split('/').pop().split('.')[0]; // Extract the public ID from the URL
      await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
    }

    await note.save();
    res.status(200).json({ message: "Attachment removed successfully.", note });
  } catch (err) {
    console.error("Remove Attachment Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
export const saveCoordinates = async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    // Validate coordinates
    if (x === undefined || y === undefined) {
      return res.status(400).json({ message: "Coordinates x and y are required" });
    }

    // Find the note by ID
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update coordinates
    note.x = x;
    note.y = y;
    await note.save();

    res.status(200).json({ message: "Coordinates saved successfully", note });
  } catch (err) {
    console.error("Save Coordinates Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getCoordinates = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note by ID
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const { x, y } = note;
    res.status(200).json({ x, y });
  } catch (err) {
    console.error("Get Coordinates Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};