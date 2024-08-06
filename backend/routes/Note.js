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
import upload from "../middleware/multer.js";

const router = express.Router();

// Route to create a new note
router.post("/create", TokenVerification, upload.array("files"), CreateNote);

// Route to get all notes for the current user
router.get("/all", TokenVerification, getAllNotes);

// Route to update a note by ID
router.put("/:id", TokenVerification, upload.array("files"), updateNote);

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
