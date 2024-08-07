import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaPlus, FaTrash, FaFilter } from "react-icons/fa";
import {
  createNote,
  deleteNote,
  fetchNotes,
  getCoordinates,
  saveCoordinates,
  updateNote,
  updateNotePosition,
} from "../state/notes/noteSlice"; // Adjust the path as necessary
import { logoutUser } from "../state/auth/AuthSlice"; // Import the logoutUser action
import { useNavigate } from "react-router-dom"; // If using react-router for navigation

const colors = ["#ff88cc", "#ffdd55", "#88ffcc", "#88ddff", "#dd88ff"];

const NotesPage = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: colors[0],
    group: [],
    x: 0,
    y: 0,
  });
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [draggingNote, setDraggingNote] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingNote, setEditingNote] = useState(null); // State for editing note
  const [clickTriggeredEdit, setClickTriggeredEdit] = useState(false); // New state for tracking click events

  const containerRef = useRef(null);
  const draggedPositionRef = useRef({ x: 0, y: 0 });
  const navigate = useNavigate(); // If using react-router for navigation

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const addNote = () => {
    dispatch(
      createNote({
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    setNewNote({
      title: "",
      content: "",
      color: colors[0],
      group: [],
      x: 0,
      y: 0,
    });
    setShowCreateNote(false);
  };

  const updateExistingNote = () => {
    if (editingNote) {
      dispatch(
        updateNote({
          noteId: editingNote._id,
          noteData: {
            ...editingNote,
            updatedAt: new Date().toISOString(),
          },
        })
      );
      setEditingNote(null);
    }
  };

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    // Fetch coordinates for each note
    notes.forEach((note) => {
      dispatch(getCoordinates(note._id));
    });
  }, [notes, dispatch]);

  const deleteNoteHandler = (id) => {
    dispatch(deleteNote(id));
  };

  const handleMouseDown = (e, note) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNote(note);
    draggedPositionRef.current = { x: note.x, y: note.y };
    setClickTriggeredEdit(false); 
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (draggingNote && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;
  
        // Debugging logs
        console.log('Container Rect:', containerRect);
        console.log('ClientX:', e.clientX, 'ClientY:', e.clientY);
        console.log('Offset X:', dragOffset.x, 'Offset Y:', dragOffset.y);
        console.log('New X:', newX, 'New Y:', newY);
  
        const noteElement = document.getElementById(`note-${draggingNote._id}`);
        if (noteElement) {
          noteElement.style.left = `${newX}px`;
          noteElement.style.top = `${newY}px`;
        }
  
        draggedPositionRef.current = { x: newX, y: newY };
        dispatch(
          updateNotePosition({ noteId: draggingNote._id, x: newX, y: newY })
        );
      }
    },
    [draggingNote, dragOffset, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    if (draggingNote) {
      dispatch(
        updateNote({
          noteId: draggingNote._id,
          noteData: draggedPositionRef.current,
        })
      );
      dispatch(
        saveCoordinates({
          noteId: draggingNote._id,
          coordinates: draggedPositionRef.current,
        })
      );
      setDraggingNote(null);
      if (!clickTriggeredEdit) {
        // Only set to editing mode if not dragging
        setEditingNote(draggingNote);
      }
    }
  }, [draggingNote, clickTriggeredEdit, dispatch]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleNoteClick = (note) => {
    if (!draggingNote) {
      // Ensure note is not being dragged
      setEditingNote(note);
      setClickTriggeredEdit(true); // Mark click as edit trigger
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedGroup === "All" || note.group.includes(selectedGroup))
  );

  const groups = Array.from(
    new Set(notes.flatMap((note) => note.group))
  ).sort();

  const logoutHandler = () => {
    dispatch(logoutUser());
    // Optionally navigate to login page after logging out
    navigate("/login");
  };

  return (
    <div className="relative p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border bg-[#fff] border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateNote(!showCreateNote)}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Note
          </button>
          <button
            onClick={() => setSelectedGroup("All")}
            className="bg-gray-500 text-white p-2 rounded flex items-center"
          >
            <FaFilter className="mr-2" />
            All Groups
          </button>
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className="bg-gray-300 text-black p-2 rounded flex items-center"
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {showCreateNote && (
        <div className="mb-4 p-4 bg-white border border-gray-300 rounded w-80">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="p-2 border text-[#000] bg-[#fff] border-gray-300 rounded mb-2 w-full"
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            className="p-2 border text-[#000] bg-[#fff] border-gray-300 rounded mb-2 w-full"
            rows="4"
          />
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[#000] ">Color:</span>
            {colors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full mr-2 cursor-pointer ${
                  color === newNote.color ? "border-2 border-black" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setNewNote({ ...newNote, color })}
              />
            ))}
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-[#000] ">Groups:</span>
            <input
              type="text"
              placeholder="Add group"
              value={newNote.group.join(", ")}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  group: e.target.value.split(",").map((g) => g.trim()),
                })
              }
              className="p-2 border text-[#000] bg-[#fff] border-gray-300 rounded mb-2 w-full"
            />
          </div>
          <button
            onClick={addNote}
            className="bg-blue-500 text-white p-2 rounded flex justify-center items-center"
          >
            Add Note
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            id={`note-${note._id}`}
            className="p-4 bg-white border border-gray-300 rounded relative cursor-move w-80"
            style={{
              backgroundColor: note.color,
              left: `${note.x}px`,
              top: `${note.y}px`,
              zIndex: draggingNote && draggingNote._id === note._id ? 1000 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, note)}
            onClick={() => handleNoteClick(note)} // Updated to use handleNoteClick
          >
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p className="mt-2">{note.content}</p>
            {note.group && note.group.length > 0 && (
              <p className="font-bold text-[#000]">
                Group: {note.group.join(", ")}
              </p>
            )}
            <button
              onClick={() => deleteNoteHandler(note._id)}
              className="mt-2 bg-red-500 text-white p-2 rounded flex justify-center items-center"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>

      {editingNote && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white bg-[#fff] p-4 rounded shadow-md w-80">
            <h2 className="text-xl  text-[#000] font-bold mb-4">Edit Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={editingNote.title}
              onChange={(e) =>
                setEditingNote({ ...editingNote, title: e.target.value })
              }
              className="p-2 border text-[#000] bg-[#fff] border-gray-300 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Content"
              value={editingNote.content}
              onChange={(e) =>
                setEditingNote({ ...editingNote, content: e.target.value })
              }
              className="p-2 border text-[#000] bg-[#fff] border-gray-300 rounded mb-2 w-full"
              rows="4"
            />
            <div className="flex items-center mb-2">
              <span className="mr-2 text-[#000] ">Color:</span>
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full mr-2 cursor-pointer ${
                    color === editingNote.color ? "border-2 border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEditingNote({ ...editingNote, color })}
                />
              ))}
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2 text-[#000]">Groups:</span>
              <input
                type="text"
                placeholder="Add group"
                value={editingNote.group.join(", ")}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    group: e.target.value.split(",").map((g) => g.trim()),
                  })
                }
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setEditingNote(null)}
                className="bg-gray-500 text-white p-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={updateExistingNote}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={logoutHandler}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded flex items-center"
      >
        Logout
      </button>
    </div>
  );
};

export default NotesPage;
