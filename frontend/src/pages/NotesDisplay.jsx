import  { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaPlus, FaTrash, FaFilter } from 'react-icons/fa';
import { createNote, deleteNote, fetchNotes, getCoordinates, saveCoordinates, updateNote, updateNotePosition } from '../state/notes/noteSlice'; // Adjust the path as necessary

const colors = ['#ff88cc', '#ffdd55', '#88ffcc', '#88ddff', '#dd88ff'];

const NotesPage = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', color: colors[0], group: [], x: 0, y: 0 });
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [draggingNote, setDraggingNote] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const draggedPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const addNote = () => {
    dispatch(createNote({
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setNewNote({ title: '', content: '', color: colors[0], group: [], x: 0, y: 0 });
    setShowCreateNote(false);
  };

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    // Fetch coordinates for each note
    notes.forEach(note => {
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
      y: e.clientY - rect.top
    });
    setDraggingNote(note);
    draggedPositionRef.current = { x: note.x, y: note.y };
  };

  const handleMouseMove = useCallback((e) => {
    if (draggingNote && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;
      
      const noteElement = document.getElementById(`note-${draggingNote._id}`);
      if (noteElement) {
        noteElement.style.left = `${newX}px`;
        noteElement.style.top = `${newY}px`;
      }
      
      draggedPositionRef.current = { x: newX, y: newY };
      dispatch(updateNotePosition({ noteId: draggingNote._id, x: newX, y: newY }));
    }
  }, [draggingNote, dragOffset]);
//   const handleMouseMove = useCallback((e) => {
//     if (draggingNote && containerRef.current) {
//       const containerRect = containerRef.current.getBoundingClientRect();
//       const newX = e.clientX - containerRect.left - dragOffset.x;
//       const newY = e.clientY - containerRect.top - dragOffset.y;
      
//       const noteElement = document.getElementById(`note-${draggingNote._id}`);
//       if (noteElement) {
//         noteElement.style.left = `${newX}px`;
//         noteElement.style.top = `${newY}px`;
//       }
      
//       draggedPositionRef.current = { x: newX, y: newY };
      
//     }
//   }, [draggingNote, dragOffset, dispatch]);

  const handleMouseUp = useCallback(() => {
    if (draggingNote) {
      dispatch(updateNote({
        noteId: draggingNote._id,
        noteData: draggedPositionRef.current
      }));
      dispatch(saveCoordinates({
        noteId: draggingNote._id,
        coordinates: draggedPositionRef.current
      }));
      setDraggingNote(null);
    }
  }, [draggingNote, dispatch]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const filteredNotes = notes.filter(note => 
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedGroup === 'All' || note.group.includes(selectedGroup))
  );

  

//   const handleMouseUp = useCallback(() => {
//     if (draggingNote) {
//       dispatch(saveCoordinates({
//         noteId: draggingNote._id,
//         coordinates: draggedPositionRef.current
//       }));
//       setDraggingNote(null);
//     }
//   }, [draggingNote, dispatch]);


  const groups = Array.from(new Set(notes.flatMap(note => note.group))).sort();

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
            className="p-2 border border-gray-300 rounded"
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
            onClick={() => setSelectedGroup('All')}
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
        <div className="mb-4 p-4 bg-white border border-gray-300 rounded">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2 w-full"
          />
          <textarea
            placeholder="Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2 w-full"
            rows="4"
          />
          <div className="flex items-center mb-2">
            <span className="mr-2">Color:</span>
            {colors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full mr-2 cursor-pointer ${color === newNote.color ? 'border-2 border-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewNote({ ...newNote, color })}
              />
            ))}
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">Groups:</span>
            <input
              type="text"
              placeholder="Add group"
              value={newNote.group.join(', ')}
              onChange={(e) => setNewNote({ ...newNote, group: e.target.value.split(',').map(g => g.trim()) })}
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            />
          </div>
          <button
            onClick={addNote}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Note
          </button>
        </div>
      )}

      <div ref={containerRef} className="relative" style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            id={`note-${note._id}`}
            className="absolute p-4 border rounded cursor-move"
            style={{ 
              backgroundColor: note.color,
              top: `${note.y}px`,
              left: `${note.x}px`,
              zIndex: draggingNote && draggingNote._id === note._id ? 1000 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, note)}
          >
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p>{note.content}</p>
            <p className="text-sm text-gray-500">Groups: {note.group.join(', ')}</p>
            <button
              onClick={() => deleteNoteHandler(note._id)}
              className="bg-red-500 text-white p-2 rounded mt-2 flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;