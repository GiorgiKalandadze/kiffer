import {useRef, useState} from 'react';
import config from '../../config';
import styles from './styles/AddImage.module.css';
import {Button, CircularProgress, TextField} from '@mui/material';
import defaultImage from 'assets/images/default_image.png';

export default function AddImage() {
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState(''); // New state variable for the TextField value
    const fileInputRef = useRef(); // New ref for the file input



    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        console.log(event.detail);
        console.log(event.currentTarget.files);
        if (file.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }
        setFile(file);
        setImage(URL.createObjectURL(file)); // TODO: Revoke object URL
        setError(null);

    };

    const handleSubmit = async (event) => {
        function parseTags() {
            const tagsArray = tags.split(',');
            return tagsArray.map((tag) => tag.trim());
        }

        event.preventDefault();
        if (!file) {
            setError('File is required');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('tags', parseTags());
        try {
            const response = await fetch(`${config.apiEndpoint}/v1/image`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
            setSuccess(true);
            setLoading(false);
            // Reset the form fields
            setImage('');
            setFile(null);
            setError(null);
            setTags('');
            fileInputRef.current.value = ''; // Clear the file input

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles['container']}>
            <form className={styles['form']} onSubmit={handleSubmit}>
                <TextField
                    sx={{
                        marginBottom: "var(--style-space-24)",
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: 'var(--style-color-primary)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--style-color-primary)',
                            },
                        },
                        '& .MuiInputLabel-shrink': {
                            color: 'var(--style-color-primary)',
                        },
                    }}
                    type="text"
                    label="Tags"
                    variant="outlined"
                    value={tags} // Set the TextField value to the state variable
                    onChange={(event) => setTags(event.target.value)} // Update the state variable when the TextField value changes
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <input
                    type="file"
                    accept="image/*"
                    required
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                {error && <div>{error}</div>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
                {success && <div>Image uploaded successfully</div>}
            </form>
            {<img className={styles['preview-img']} src={image || defaultImage} alt="Preview" />}
        </div>


    );
}