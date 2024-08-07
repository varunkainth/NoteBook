import  { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import StickyNote from './StickyNote';
import { FaSearch } from 'react-icons/fa';

const colors = ['#ff88cc', '#ffdd55', '#88ffcc', '#88ddff', '#dd88ff'];

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load notes from local storage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to local storage
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: [Math.floor(Math.random())],
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id, content) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const changeNoteColor = (id, color) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              color,
            }
          : note
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedNotes = Array.from(notes);
    const [removed] = reorderedNotes.splice(result.source.index, 1);
    reorderedNotes.splice(result.destination.index, 0, removed);

    setNotes(reorderedNotes);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-5 bg-pink-100 min-h-screen font-comic">
      <div className="flex items-center bg-gray-100 rounded-full p-2 my-4 w-80">
        <FaSearch className="text-gray-500 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none text-lg"
        />
      </div>
      <button
        onClick={addNote}
        className="py-2 px-4 my-4 text-white bg-pink-400 rounded-md hover:bg-pink-300"
      >
        Add Note
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-5 overflow-x-auto w-full max-w-screen-lg"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredNotes.map((note, index) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  index={index}
                  onDelete={deleteNote}
                  onEdit={editNote}
                  onColorChange={changeNoteColor}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default StickyNotes;
