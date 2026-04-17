import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Calender from './components/Calender';
import Prayer from './components/Prayer';
import Surah from './components/Surah';
import Detail from './components/Detail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Juz from './components/Juz';
import Hadith from './components/Hadith';
import Search from './components/Search';

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
        <Route path="/juz" element={<Juz />} />
        <Route path="/hadith" element={<Hadith />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;