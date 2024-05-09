import {useState} from 'react';
import useFetch from '../../common/custom-hooks/useFetch';
import config from '../../config';
import styles from './styles/GalleryView.module.css';
import Masonry from 'react-masonry-css';
import {TextField} from '@mui/material';
import useDebounce from '../../common/custom-hooks/useDebounce';
import {Link} from 'react-router-dom';

export default function GalleryView() {
    console.log('GalleryView rendered');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 700);
    const {
        response = null,
        loading = true,
        error = false,
    } = useFetch(`${config.apiEndpoint}/v1/images?filterTags=${debouncedSearchTerm}`);
    const list = response ? response.data?.list : null;

    const handleSearchChange = (event) => {
        setSearchTerm(event.currentTarget.value);
    };

    return list && (
        <div className={styles['container']}>
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
                }}
                type="text"
                placeholder="Search by tag or name"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {list?.length ?
                <Masonry
                    breakpointCols={{
                        default: 4,
                        1200: 3,
                        600: 2,
                    }}
                    className={styles['my-masonry-grid']}
                    columnClassName={styles['my-masonry-grid_column']}
                >
                    {list.map(({id, downloadURL}) => (
                        <Link to={`/image/${id}`} key={id}>
                            <img
                                className={styles['img-card']}
                                key={id}
                                src={downloadURL}
                                alt="Image"
                                loading="lazy"
                            />
                        </Link>
                    ))}
                </Masonry>
                : <p>TODO: Nothing found</p>}
        </div>

    );
}