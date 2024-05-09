import { useParams } from 'react-router-dom';
import styles from './styles/ImageDetails.module.css';
import useFetch from '../../common/custom-hooks/useFetch';
import config from '../../config';
import {Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ImageDetails() {
    const { id } = useParams();

    const { response = null, loading = true, error = false } = useFetch(`${config.apiEndpoint}/v1/image/${id}`);
    const image = response ? response.data : null;
    const navigate = useNavigate();

    const handleDelete = async () => {
        console.log(image);
        const response = await fetch(`${config.apiEndpoint}/v1/image/${image.id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        navigate('/'); // Redirect to homepage

    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading image details</div>;
    }

    return (
        <div>
            <img className={styles['img-card']} src={image.downloadURL} alt={image.title} />
            <p>{image.tags}</p>
            <Button onClick={handleDelete}>Delete</Button>
        </div>
    );
}