import { Link } from 'react-router-dom';
import styles from './styles/Header.module.css';
export default function Header() {
    console.log('Header');
    return (
        <header className={styles['header']}>
            <div className="logo">
                <img src="https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633112041/addgif/logo.png" alt="Logo" />
            </div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add-image">Add Image</Link></li>
                </ul>
            </nav>
        </header>
    );
}