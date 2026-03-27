import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Juz = () => {
  const [juzList, setJuzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [juzDetails, setJuzDetails] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const navigate = useNavigate();

  // Juz names/descriptions (optional, for better UX)
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

  // Create juz list with basic info
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

  // Fetch detailed Juz data when selected
  const fetchJuzDetails = async (juzNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Arabic text
      const arabicRes = await fetch(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`
      );
      if (!arabicRes.ok) throw new Error('Failed to fetch Arabic text');
      const arabicData = await arabicRes.json();
      
      // Fetch English translation (using Sahih International)
      const englishRes = await fetch(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/en.sahih`
      );
      if (!englishRes.ok) throw new Error('Failed to fetch English translation');
      const englishData = await englishRes.json();
      
      // Combine Arabic and English ayahs
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
      <div style={{ 
        textAlign: "center", 
        marginTop: "clamp(80px, 20vh, 100px)",
        padding: "20px",
        fontSize: "clamp(14px, 4vw, 16px)"
      }}>
        <div style={{
          width: "clamp(40px, 8vw, 50px)",
          height: "clamp(40px, 8vw, 50px)",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #28a745",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        Loading Juz...
      </div>
    );
  }

  if (error && viewMode === 'list') {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "clamp(80px, 20vh, 100px)", 
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "clamp(15px, 4vw, 20px)",
          borderRadius: "10px",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <h3 style={{ marginBottom: "10px" }}>Error Loading Juz</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px"
            }}
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
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#28a745,#20c997)",
            color: "white",
            textAlign: "center",
            padding: "clamp(25px, 5vw, 40px)",
            marginTop: "56px",
            position: "relative",
          }}
        >
          <button
            onClick={goBackToList}
            style={{
              position: "absolute",
              left: "clamp(10px, 3vw, 20px)",
              top: "clamp(10px, 3vw, 20px)",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 15px)",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "clamp(12px, 2.5vw, 14px)",
            }}
          >
            ← Back to Juz List
          </button>

          <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)" }}>
            Juz {juzDetails.number}
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>
            {juzDetails.startSurah} - {juzDetails.endSurah} • {juzDetails.totalAyahs} Ayahs
          </p>
        </div>

        {/* Ayah List */}
        <div
          style={{
            padding: "clamp(15px, 4vw, 25px)",
            background: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            {juzDetails.ayahs.map((ayah) => (
              <div
                key={ayah.number}
                style={{
                  background: "white",
                  marginBottom: "15px",
                  padding: "clamp(15px, 4vw, 20px)",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Ayah Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#28a745",
                      fontSize: "clamp(12px, 3vw, 14px)",
                      backgroundColor: "#f8f9fa",
                      padding: "4px 12px",
                      borderRadius: "20px"
                    }}
                  >
                    Surah {ayah.surahEnglishName} • Ayah {ayah.numberInSurah}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(10px, 2.5vw, 12px)",
                      color: "#6c757d",
                      backgroundColor: "#f8f9fa",
                      padding: "4px 12px",
                      borderRadius: "20px"
                    }}
                  >
                    Page {ayah.page}
                  </div>
                </div>

                {/* Arabic Text */}
                <div
                  style={{
                    fontSize: "clamp(20px, 5vw, 26px)",
                    textAlign: "right",
                    margin: "15px 0",
                    direction: "rtl",
                    fontFamily: "serif",
                    lineHeight: "1.8",
                    color: "#2c3e50"
                  }}
                >
                  {ayah.arabic}
                </div>

                {/* English Translation */}
                <div
                  style={{
                    color: "#555",
                    fontSize: "clamp(14px, 3vw, 16px)",
                    lineHeight: "1.6",
                    borderTop: "1px solid #e9ecef",
                    paddingTop: "15px",
                    marginTop: "5px"
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#28a745" }}>
                    Translation:{" "}
                  </span>
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
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          padding: 'clamp(40px, 10vw, 60px) 20px',
          textAlign: 'center',
          color: 'white',
          marginTop: '56px'
        }}
      >
        <h1 style={{ 
          fontSize: 'clamp(32px, 8vw, 48px)', 
          marginBottom: '10px' 
        }}>
          Juz (Parts) of Quran
        </h1>
        <p style={{ 
          fontSize: 'clamp(14px, 4vw, 18px)', 
          opacity: 0.9 
        }}>
          30 Juz • The Holy Quran Divided into 30 Equal Parts
        </p>
      </div>

      {/* Juz Grid */}
      <div style={{
        padding: 'clamp(30px, 5vw, 40px) clamp(15px, 4vw, 20px)',
        backgroundColor: '#f8f9fa',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 90vw, 350px), 1fr))',
          gap: 'clamp(15px, 4vw, 20px)'
        }}>
          {juzList.map((juz) => (
            <div
              key={juz.number}
              onClick={() => handleJuzClick(juz.number)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #e9ecef'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {/* Juz Number Badge */}
              <div style={{
                backgroundColor: '#28a745',
                padding: 'clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)',
                display: 'inline-block',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '0 0 10px 0',
                fontSize: 'clamp(14px, 3.5vw, 16px)'
              }}>
                Juz {juz.number}
              </div>

              <div style={{ padding: 'clamp(15px, 4vw, 20px)' }}>
                <h3 style={{
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: 'bold',
                  color: '#28a745',
                  marginBottom: '10px'
                }}>
                  {juz.name}
                </h3>
                
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#6c757d',
                  marginBottom: '15px'
                }}>
                  Starts at: {juz.start}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e9ecef'
                }}>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: '#28a745',
                    fontWeight: '500'
                  }}>
                    Part {juz.number} of 30
                  </div>
                  
                  <div style={{
                    color: '#20c997',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '500'
                  }}>
                    Read Juz →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(15px, 4vw, 20px)',
        backgroundColor: '#e9ecef',
        color: '#6c757d'
      }}>
        <p style={{ 
          margin: 0,
          fontSize: 'clamp(12px, 3.5vw, 14px)'
        }}>
          القرآن الكريم • The Holy Quran • 30 Juz
        </p>
      </div>
    </>
  );
};

export default Juz;