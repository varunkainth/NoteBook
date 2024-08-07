/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { FaSave, FaEdit, FaTrash, FaPalette } from 'react-icons/fa';

const NoteContainer = styled.div`
  background-color: ${(props) => props.color};
  padding: 20px;
  border-radius: 12px;
  margin: 10px;
  width: 160px;
  min-height: 120px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: grab;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const NoteContent = styled.textarea`
  width: 100%;
  height: 60%;
  border: none;
  background: transparent;
  resize: none;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #333;
`;

const Button = styled.button`
  background: transparent;
  color: #ffff;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 1.2em;
  margin: 5px;
  &:hover {
    color: #ff66bb;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 5px;
`;

const ColorOption = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 2px;
  cursor: pointer;
  background-color: ${(props) => props.color};
`;

const DateTime = styled.div`
  font-size: 0.8em;
  color: #555;
`;

const StickyNote = ({ note, index, onDelete, onEdit, onColorChange }) => {
  const [content, setContent] = useState(note.content);
  const [editing, setEditing] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const colors = ['#ff88cc', '#ffdd55', '#88ffcc', '#88ddff', '#dd88ff'];

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onEdit(note.id, content);
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handleColorChange = (color) => {
    onColorChange(note.id, color);
    setShowPalette(false);
  };

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided) => (
        <NoteContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          color={note.color}
        >
          <NoteContent
            value={content}
            onChange={handleContentChange}
            placeholder="Type your note here..."
            readOnly={!editing}
          />
          <DateTime>{note.date} {note.time}</DateTime>
          <div style={{ display: 'flex' }}>
            <Button onClick={handleDelete}>
              <FaTrash />
            </Button>
            <Button onClick={() => setEditing(!editing)}>
              <FaEdit />
            </Button>
            {editing && (
              <Button onClick={handleSave}>
                <FaSave />
              </Button>
            )}
            <Button onClick={() => setShowPalette(!showPalette)}>
              <FaPalette />
            </Button>
          </div>
          {showPalette && (
            <ColorPalette>
              {colors.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </ColorPalette>
          )}
        </NoteContainer>
      )}
    </Draggable>
  );
};

export default StickyNote;


  