import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNote } from '../state/notes/noteSlice';

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#ffffff'); // Default color white
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNote({
            title: title,
            content:content,
            color:color,
        }));
        setTitle(''); // Clear the title after submission
        setContent(''); // Clear the content after submission
        setColor('#ffffff'); // Reset color to default
    };

    return (
        <div className="max-w-md mx-auto my-4 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create a New Note</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter note title"
                />
                <textarea
                    className="w-full p-2 border rounded-md mb-4"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter note content"
                />
                <input
                    type="color"
                    className="w-full p-2 border rounded-md mb-4"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Create Note
                </button>
            </form>
        </div>
    );
};

export default CreateNote;
