import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

const AddDocument = ({ setTitle, setOpen }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setError('');
            } else {
                setError('Please upload a PDF file');
                setSelectedFile(null);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        const btn = document.getElementById('btn');
        
        if (!selectedFile) {
            setError('Please select a PDF file first');
            return;
        }

        const fileData = new FormData();
        fileData.append('file', selectedFile);
        
        try {
            setTitle(true)
            btn.innerText = "Loading..."
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                body: fileData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server returned an error');
            }

            const data = await response.json();
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            // location.reload()
            navigate('/')
            setLoading(false)
            setOpen(false)
        }
    };

    return (
        <>
            {!loading &&  <form onSubmit={handleSubmit}>
                <Box>
                    <input
                        type="file"
                        name="document"
                        id="document"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="form-control"
                        style={{ width: '100%' }}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Box>
                <Button 
                    type="submit"
                    variant="contained" 
                    color="primary" 
                    className='w-100 mt-3'
                    id='btn'
                    disabled={!selectedFile}
                >
                    Add
                </Button>
            </form>}
            {loading && <Loading />}
        </>
    );
};

export default AddDocument;
