import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import StickyNote from './StickyNote';
import { FaSearch } from 'react-icons/fa'; 

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fce4ec;
  height: 100vh;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  padding-left: 250px; /* Adjust to leave space for the sidebar */
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #ff88cc;
  color: white;
  &:hover {
    background: #ff66bb;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 5px;
  margin: 20px;
  width: 300px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 1em;
  border: none;
  background: transparent;
  border-radius: 20px;
  width: 100%;
`;

const SearchIcon = styled(FaSearch)`
  color: #888;
  font-size: 1.2em;
  margin-right: 10px;
`;

const NotesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Limit to 4 notes per row */
  gap: 20px; /* Space between notes */
  padding: 10px;
  width: 100%;
  max-width: calc(100% - 250px); /* Leave space for the sidebar */
  overflow-x: auto;
`;

const colors = ['#ff88cc', '#ffdd55', '#88ffcc', '#88ddff', '#dd88ff'];

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes'));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: uuidv4(),
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
    <AppContainer>
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      <Button onClick={addNote}>Add Note</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes" direction="horizontal">
          {(provided) => (
            <NotesContainer
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
            </NotesContainer>
          )}
        </Droppable>
      </DragDropContext>
    </AppContainer>
  );
};

export default StickyNotes;






