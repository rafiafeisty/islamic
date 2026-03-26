import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Calender from './components/Calender';
import Prayer from './components/Prayer';
import Surah from './components/Surah';
import Detail from './components/Detail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/prayer" element={<Prayer />} />
        <Route path="/surah" element={<Surah />} />
        <Route path="/surah/:surahNumber" element={<Detail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;