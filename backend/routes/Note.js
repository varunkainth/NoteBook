import express from "express";
import {
  CreateNote,
  getAllNotes,
  updateNote,
  deleteNote,
  removeAttachment,
  saveCoordinates,
  getCoordinates,
} from "../controllers/Note.js";
import TokenVerification from "../middleware/TokenVerification.js";
import upload from "../middleware/multer.js"; // Adjust the import path if necessary

const router = express.Router();

// Route to create a new note with multiple attachments
router.post("/create", TokenVerification, upload.array("attachments"), CreateNote);

// Route to get all notes for the current user
router.get("/all", TokenVerification, getAllNotes);

// Route to update a note by ID with multiple attachments
router.put("/:id", TokenVerification, upload.array("attachments"), updateNote);

// Route to delete a note by ID
router.delete("/:id", TokenVerification, deleteNote);

// Route to remove an attachment from a note
router.delete(
  "/:noteId/attachments/:attachmentId",
  TokenVerification,
  removeAttachment
);

// Route to save coordinates for a note
router.post("/:id/coordinates", TokenVerification, saveCoordinates);

// Route to get coordinates for a note
router.get("/:id/coordinates", TokenVerification, getCoordinates);

export default router;
