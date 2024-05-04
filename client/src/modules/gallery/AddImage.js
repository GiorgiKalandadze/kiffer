import {useState} from 'react';
import config from '../../config';
import styles from './styles/AddImage.module.css';
import {Button, CircularProgress, TextField} from '@mui/material';

export default function AddImage() {
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState(null);

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
        event.preventDefault();
        if (!file) {
            setError('File is required');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
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
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles['container']}>
            <form className={styles['form']} onSubmit={handleSubmit}>
                <TextField
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
            {image && <img className={styles['preview-img']} src={image} alt="Preview" />}
        </div>


    );
}