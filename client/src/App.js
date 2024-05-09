import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GalleryView from './modules/gallery/GalleryView';
import AddImage from './modules/gallery/AddImage';
import NotFoundPage from './common/NotFoundPage';
import Header from './components/Header';
import ImageDetails from './modules/gallery/ImageDetails';
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<GalleryView />} />
                    <Route path="add-image" element={<AddImage />} />
                    <Route path="image/:id" element={<ImageDetails />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;