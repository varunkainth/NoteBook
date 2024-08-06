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

const router = express.Router();

// Route to create a new note
router.post("/create", CreateNote);

// Route to get all notes for the current user
router.get("/all", getAllNotes);

// Route to update a note by ID
router.put("/:id", updateNote);

// Route to delete a note by ID
router.delete("/:id", deleteNote);

// Route to remove an attachment from a note
router.delete("/:noteId/attachments/:attachmentId", removeAttachment);

// Route to save coordinates for a note
router.post("/:id/coordinates", saveCoordinates);

// Route to get coordinates for a note
router.get("/:id/coordinates", getCoordinates);

export default router;
