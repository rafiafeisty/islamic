import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pattern from '../images/pattern.png'

const Juz = () => {
  const [juzList, setJuzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [juzDetails, setJuzDetails] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();

  const juzNames = [
    { number: 1, name: "Alif Lam Meem", start: "Al-Fatiha 1" },
    { number: 2, name: "Sayaqool", start: "Al-Baqarah 142" },
    { number: 3, name: "Tilka Ar-Rusul", start: "Al-Baqarah 253" },
    { number: 4, name: "Lan Tanaaloo", start: "Al-Imran 93" },
    { number: 5, name: "Wal Mohsanat", start: "An-Nisa 24" },
    { number: 6, name: "La Yuhibbullah", start: "An-Nisa 148" },
    { number: 7, name: "Wa Iza Samiu", start: "Al-Ma'idah 82" },
    { number: 8, name: "Wa Law Annana", start: "Al-An'am 111" },
    { number: 9, name: "Qalal Mala'u", start: "Al-A'raf 88" },
    { number: 10, name: "Wa'lamu", start: "Al-Anfal 41" },
    { number: 11, name: "Yatazeroon", start: "At-Tawbah 93" },
    { number: 12, name: "Wa Ma Min Da'bbah", start: "Hud 6" },
    { number: 13, name: "Wa Ma Ubrioo", start: "Yusuf 53" },
    { number: 14, name: "Alif Laam Raa", start: "Al-Hijr 1" },
    { number: 15, name: "Subhanalladhi", start: "Al-Isra 1" },
    { number: 16, name: "Qala Alam", start: "Al-Kahf 75" },
    { number: 17, name: "Iqtaraba", start: "Al-Anbiya 1" },
    { number: 18, name: "Qad Aflaha", start: "Al-Mu'minun 1" },
    { number: 19, name: "Wa Qalalladhina", start: "Al-Furqan 21" },
    { number: 20, name: "Ammman", start: "An-Naml 56" },
    { number: 21, name: "Utlu", start: "Al-Ankabut 46" },
    { number: 22, name: "Wa Manyaqnut", start: "Al-Ahzab 31" },
    { number: 23, name: "Wa Mali", start: "Ya-Sin 28" },
    { number: 24, name: "Faman Azlamu", start: "Az-Zumar 32" },
    { number: 25, name: "Ilayhi Yuraddu", start: "Fussilat 47" },
    { number: 26, name: "Ha'a Meem", start: "Al-Ahqaf 1" },
    { number: 27, name: "Qala Fama", start: "Adh-Dhariyat 31" },
    { number: 28, name: "Qad Sami'allah", start: "Al-Mujadila 1" },
    { number: 29, name: "Tabarakalladhi", start: "Al-Mulk 1" },
    { number: 30, name: "Amma Yatasa'aloon", start: "An-Naba 1" }
  ];

  useEffect(() => {
    const juzData = [];
    for (let i = 1; i <= 30; i++) {
      const juzInfo = juzNames.find(j => j.number === i) || { name: `Juz ${i}`, start: `Juz ${i}` };
      juzData.push({
        number: i,
        name: juzInfo.name,
        start: juzInfo.start
      });
    }
    setJuzList(juzData);
    setLoading(false);
  }, []);

  const fetchJuzDetails = async (juzNumber) => {
    try {
      setLoading(true);
      setError(null);

      const arabicRes = await fetch(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`
      );
      if (!arabicRes.ok) throw new Error('Failed to fetch Arabic text');
      const arabicData = await arabicRes.json();

      const englishRes = await fetch(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/en.sahih`
      );
      if (!englishRes.ok) throw new Error('Failed to fetch English translation');
      const englishData = await englishRes.json();

      const combinedAyahs = arabicData.data.ayahs.map((ayah, index) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        surahName: ayah.surah.name,
        surahEnglishName: ayah.surah.englishName,
        arabic: ayah.text,
        english: englishData.data.ayahs[index]?.text || '',
        juz: ayah.juz,
        page: ayah.page
      }));

      setJuzDetails({
        number: juzNumber,
        ayahs: combinedAyahs,
        totalAyahs: combinedAyahs.length,
        startSurah: combinedAyahs[0]?.surahEnglishName || '',
        endSurah: combinedAyahs[combinedAyahs.length - 1]?.surahEnglishName || ''
      });
      setViewMode('detail');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load Juz details');
      setLoading(false);
    }
  };

  const handleJuzClick = (juzNumber) => {
    fetchJuzDetails(juzNumber);
  };

  const goBackToList = () => {
    setViewMode('list');
    setJuzDetails(null);
  };

  if (loading && viewMode === 'list') {
    return (
      <div className="mt-20 flex justify-center items-center min-h-screen p-5">
        <div className="text-center">
          <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-5"></div>
          <p className="text-green-600">Loading Juz...</p>
        </div>
      </div>
    );
  }

  if (error && viewMode === 'list') {
    return (
      <div className="mt-20 flex justify-center items-center min-h-screen p-5">
        <div className="text-center bg-red-100 text-red-700 p-5 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl mb-2">Error Loading Juz</h3>
          <p className="mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Detail View
  if (viewMode === 'detail' && juzDetails) {
    return (
      <>
        <div className="text-emerald-700 text-center pt-12 pb-8 px-4 mt-14 relative">
          <button
            onClick={goBackToList}
            className="absolute left-4 top-4 bg-emerald-900 hover:bg-emerald-900/70 text-white px-3 py-1 rounded-full text-sm transition-all"
          >
            ← Back to Juz List
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Juz {juzDetails.number}
          </h1>
          <p className="text-sm sm:text-base mt-2">
            {juzDetails.startSurah} - {juzDetails.endSurah} • {juzDetails.totalAyahs} Ayahs
          </p>
        </div>

        <div className="bg-gray-100 py-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {juzDetails.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="bg-white mb-4 p-4 sm:p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                  <div className="font-bold text-emerald-600 text-xs sm:text-sm bg-gray-100 px-3 py-1 rounded-full">
                    Surah {ayah.surahEnglishName} • Ayah {ayah.numberInSurah}
                  </div>
                  <div className="text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full">
                    Page {ayah.page}
                  </div>
                </div>

                <div className="text-right text-xl sm:text-2xl md:text-3xl my-4 font-serif leading-relaxed text-gray-800">
                  {ayah.arabic}
                </div>

                <div className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3 border-t border-gray-200">
                  <span className="font-bold text-emerald-600">Translation: </span>
                  {ayah.english}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // List View
  return (
    <>
      <div className="text-center grid text-emerald-700 justify-center items-center pt-16 pb-12 px-4 mt-14">
        <h1 className="text-4xl sm:text-5xl md:text-6xl mb-2">
          Juz (Parts) of Quran
        </h1>
        <p className="text-sm sm:text-base opacity-90">
          30 Juz • The Holy Quran Divided into 30 Equal Parts
        </p>
        <img
          src={pattern}
          alt="pattern"
          className="mx-auto mt-8 opacity-75 w-48"
        />
      </div>

      <div className="bg-gray-100 py-8 px-4 sm:px-6 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {juzList.map((juz) => (
              <div
                key={juz.number}
                onClick={() => handleJuzClick(juz.number)}
                className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-[1px] border-emerald-400 overflow-hidden"
              >
                <div className="bg-emerald-600 text-white font-bold inline-block px-3 py-1 rounded-br-lg text-xs sm:text-sm">
                  Juz {juz.number}
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-2">
                    {juz.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    Starts at: {juz.start}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs sm:text-sm text-green-600 font-medium">
                      Part {juz.number} of 30
                    </div>

                    <div className="text-teal-500 text-xs sm:text-sm font-medium">
                      Read Juz →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Juz;