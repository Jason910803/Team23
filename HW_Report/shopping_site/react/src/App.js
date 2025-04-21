import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";

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
