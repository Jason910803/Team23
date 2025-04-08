import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';


function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Router>
    );
  }

export default App;
