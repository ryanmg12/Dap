import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import AddBusiness from './pages/AddBusiness';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/add" element={<AddBusiness />} />
        <Route path="/businesses/:id" element={<BusinessDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

