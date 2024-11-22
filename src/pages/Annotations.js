import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';

export default function Annotations() {
  const [annotations, setAnnotations] = useState([]);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAnnotations = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await api.get('/annotations', {
        params: {
          page,
          size: 8
        }
      });
      setAnnotations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnotations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/annotations', { description, completed: false });
      setDescription('');
      fetchAnnotations(currentPage);
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };

  const handleUpdate = async (id, completed) => {
    try {
      await api.put('/annotations', {
        id,
        description: editingId === id ? editingDescription : annotations.find(a => a.id === id).description,
        completed,
      });
      setEditingId(null);
      fetchAnnotations(currentPage);
    } catch (error) {
      console.error('Error updating annotation:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/annotations/${id}`);
      fetchAnnotations(currentPage);
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Annotations</h1>
        <span className="text-1xl">({totalElements})</span>
      </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New annotation"
              className="flex-1 p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            {annotations.map((annotation) => (
              <div key={annotation.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
                <input
                  type="checkbox"
                  checked={annotation.completed}
                  onChange={() => handleUpdate(annotation.id, !annotation.completed)}
                  className="h-5 w-5"
                />
                
                {editingId === annotation.id ? (
  <input
    type="text"
    value={editingDescription}
    onChange={(e) => setEditingDescription(e.target.value)}
    className="flex-1 p-2 border rounded"
    onBlur={() => handleUpdate(annotation.id, annotation.completed)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUpdate(annotation.id, annotation.completed);
      }
    }}
    autoFocus
  />
) : (
  <span
    className={`flex-1 ${annotation.completed ? 'line-through text-gray-500' : ''}`}
    onClick={() => {
      setEditingId(annotation.id);
      setEditingDescription(annotation.description);
    }}
  >
    {annotation.description}
  </span>
)}

                <button
                  onClick={() => handleDelete(annotation.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => fetchAnnotations(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => fetchAnnotations(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}