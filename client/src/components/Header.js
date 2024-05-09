import { Link } from 'react-router-dom';
import styles from './styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles['header']}>
            <Link className={styles['nav-link']} to="/">Home</Link>
            <Link className={styles['nav-link']} to="/add-image">Add Image</Link>
        </header>
    );
}