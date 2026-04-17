import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Detail = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();

  const [surahInfo, setSurahInfo] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playing, setPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef(null);

  const [tafseers, setTafseers] = useState({});
  const [showTafseer, setShowTafseer] = useState({});
  const [showWordByWord, setShowWordByWord] = useState({});
  const [selectedTafsirAuthor, setSelectedTafsirAuthor] = useState({});

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchSurahDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [surahRes, arabicRes, englishRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`)
        ]);

        const surahData = await surahRes.json();
        const arabicData = await arabicRes.json();
        const englishData = await englishRes.json();

        setSurahInfo(surahData.data);

        const ayahsWithWords = await Promise.all(
          arabicData.data.ayahs.map(async (ayah, i) => {
            const ayahNumber = ayah.numberInSurah;
            try {
              const wordsRes = await fetch(
                `https://www.ummahapi.com/api/quran/words/${surahNumber}/${ayahNumber}`
              );
              const wordsData = await wordsRes.json();
              const wordDetails = wordsData.success && wordsData.data.words ? wordsData.data.words : [];

              return {
                number: ayahNumber,
                arabic: ayah.text,
                english: englishData.data.ayahs[i]?.text || "",
                words: wordDetails
              };
            } catch (err) {
              console.error(`Failed to fetch words for ayah ${ayahNumber}:`, err);
              return {
                number: ayahNumber,
                arabic: ayah.text,
                english: englishData.data.ayahs[i]?.text || "",
                words: []
              };
            }
          })
        );

        setAyahs(ayahsWithWords);
      } catch (err) {
        console.error(err);
        setError("Failed to load Surah data");
      } finally {
        setLoading(false);
      }
    };

    fetchSurahDetails();
  }, [surahNumber]);

  // Audio functions
  const playSurah = () => {
    if (!audioEnabled) return;
    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`
    );
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.error("Audio error:", err);
      alert("Audio playback failed");
    });
    setPlaying(true);
    audio.onended = () => setPlaying(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
  };

  // Updated Tafseer handler using the new API
  const handleTafseerToggle = async (ayahNum) => {
    if (showTafseer[ayahNum]) {
      setShowTafseer(prev => ({ ...prev, [ayahNum]: false }));
      return;
    }

    setShowTafseer(prev => ({ ...prev, [ayahNum]: true }));

    // Fetch if not already loaded
    if (!tafseers[ayahNum]) {
      try {
        const res = await fetch(
          `https://quranapi.pages.dev/api/tafsir/${surahNumber}_${ayahNum}.json`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        // Store all tafsirs for this ayah
        setTafseers(prev => ({ 
          ...prev, 
          [ayahNum]: {
            surahName: data.surahName,
            surahNo: data.surahNo,
            ayahNo: data.ayahNo,
            tafsirs: data.tafsirs || []
          }
        }));
        
        // Set default selected author to first one
        if (data.tafsirs && data.tafsirs.length > 0) {
          setSelectedTafsirAuthor(prev => ({ 
            ...prev, 
            [ayahNum]: data.tafsirs[0].author 
          }));
        }
      } catch (err) {
        console.error("Tafseer fetch error:", err);
        setTafseers(prev => ({ 
          ...prev, 
          [ayahNum]: { 
            error: "Failed to load Tafseer. Please try again later.",
            tafsirs: [] 
          }
        }));
      }
    }
  };

  const toggleWordByWord = (ayahNum) => {
    setShowWordByWord(prev => ({ ...prev, [ayahNum]: !prev[ayahNum] }));
  };

  // Format tafsir content with markdown-like headings
  const formatTafsirContent = (content) => {
    if (!content) return "";
    
    // Convert markdown-style headings to HTML
    let formatted = content
      .replace(/## (.*?)\n/g, '<h3 class="text-lg font-bold text-amber-800 mt-4 mb-2">$1</h3>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br/>');
    
    return `<p class="mb-3">${formatted}</p>`;
  };

  if (loading) {
    return (
      <div className="text-center mt-24 py-10">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-5"></div>
        <p className="text-emerald-600 font-medium">Loading Surah...</p>
      </div>
    );
  }

  if (error) return <div className="text-center mt-24 py-10 text-red-600">{error}</div>;

  return (
    <>
      {/* Header */}
      <div className="text-emerald-700 text-center pt-12 pb-8 px-4 mt-14 relative">
        <button
          onClick={() => navigate("/surah")}
          className="absolute left-4 top-4 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full text-sm transition-all"
        >
          ← Back
        </button>

        <h1 className="text-3xl md:text-4xl font-bold">{surahInfo?.name}</h1>
        <p className="text-sm sm:text-base mt-2 opacity-90">
          {surahInfo?.englishName} • {surahInfo?.numberOfAyahs} Ayahs
        </p>

        {/* Audio Controls */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <button onClick={playSurah} className="bg-white text-emerald-700 px-6 py-2.5 rounded-2xl hover:bg-emerald-50 shadow-sm transition-all font-medium">
            🎵 Play Surah
          </button>
          <button onClick={stopAudio} className="bg-white text-emerald-700 px-6 py-2.5 rounded-2xl hover:bg-emerald-50 shadow-sm transition-all font-medium">
            ⏹ Stop
          </button>
        </div>
      </div>

      {/* Ayah List */}
      <div className="min-h-screen pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {ayahs.map((ayah) => (
            <div
              key={ayah.number}
              className="mb-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* Ayah Header */}
              <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-semibold text-sm">
                    {ayah.number}
                  </div>
                  <span className="font-medium text-emerald-800">Ayah {ayah.number}</span>
                </div>
              </div>

              {/* Arabic Text with Word Tooltips */}
              <div className="p-6 text-right" dir="rtl">
                <div className="flex flex-wrap justify-end gap-x-3 gap-y-4 text-2xl sm:text-3xl leading-relaxed font-serif text-gray-800">
                  {ayah.words?.length > 0 ? (
                    ayah.words.map((word) => (
                      <div key={word.position} className="group relative inline-block cursor-help">
                        <span className="hover:text-emerald-700 transition-colors">{word.arabic}</span>
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:block z-20">
                          <div className="bg-gray-900 text-white text-sm rounded-2xl px-4 py-3 whitespace-nowrap shadow-xl">
                            <div className="font-medium">{word.translation}</div>
                            {word.transliteration && (
                              <div className="text-emerald-300 text-xs mt-1">{word.transliteration.text}</div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-3xl leading-loose">{ayah.arabic}</div>
                  )}
                </div>
              </div>

              {/* English Translation */}
              <div className="px-6 pb-6 text-gray-700 leading-relaxed text-[15.5px] border-b border-gray-100">
                {ayah.english}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 border-t border-gray-100">
                <button
                  onClick={() => toggleWordByWord(ayah.number)}
                  className={`py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 hover:bg-gray-50 ${showWordByWord[ayah.number] ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600'}`}
                >
                  📖 Word by Word
                </button>
                <button
                  onClick={() => handleTafseerToggle(ayah.number)}
                  className={`py-4 text-sm font-medium transition-all flex items-center justify-center gap-2 hover:bg-gray-50 border-l border-gray-100 ${showTafseer[ayah.number] ? 'text-amber-700 bg-amber-50' : 'text-gray-600'}`}
                >
                  📜 Tafseer
                </button>
              </div>

              {/* Word by Word Section */}
              {showWordByWord[ayah.number] && ayah.words?.length > 0 && (
                <div className="px-6 pb-6 bg-emerald-50/50">
                  <div className="text-xs uppercase tracking-widest text-emerald-700 font-medium mb-3 mt-2">Word-by-Word Breakdown</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {ayah.words.map((word) => (
                      <div key={word.position} className="bg-white rounded-2xl p-4 border border-emerald-100">
                        <div className="flex justify-between items-start">
                          <span className="font-serif text-xl text-gray-800" dir="rtl">{word.arabic}</span>
                          <span className="font-mono text-emerald-600 text-xs bg-emerald-100 px-2 py-1 rounded-lg">{word.position}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <p className="text-gray-700 font-medium">{word.translation}</p>
                          {word.transliteration && (
                            <p className="text-emerald-600 text-xs italic">({word.transliteration.text})</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tafseer Section - Updated with multiple authors */}
              {showTafseer[ayah.number] && (
                <div className="bg-amber-50 border-t border-amber-100">
                  {/* Tafseer Header */}
                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                        📜 Tafseer
                      </h4>
                      <button
                        onClick={() => handleTafseerToggle(ayah.number)}
                        className="text-amber-600 hover:text-amber-800 text-xl leading-none"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Author Selection Tabs */}
                    {tafseers[ayah.number] && !tafseers[ayah.number].error && tafseers[ayah.number].tafsirs?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                        {tafseers[ayah.number].tafsirs.map((tafsir) => (
                          <button
                            key={tafsir.author}
                            onClick={() => setSelectedTafsirAuthor(prev => ({ 
                              ...prev, 
                              [ayah.number]: tafsir.author 
                            }))}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                              selectedTafsirAuthor[ayah.number] === tafsir.author
                                ? 'bg-amber-700 text-white shadow-md'
                                : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200'
                            }`}
                          >
                            {tafsir.author}
                            {tafsir.groupVerse && (
                              <span className="ml-2 text-xs opacity-75">
                                ({tafsir.groupVerse.includes('group') ? 'Group' : 'Single'})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tafseer Content */}
                  <div className="p-6 pt-0">
                    {tafseers[ayah.number] ? (
                      tafseers[ayah.number].error ? (
                        <div className="text-red-600 text-center py-8">
                          {tafseers[ayah.number].error}
                        </div>
                      ) : (
                        <>
                          {/* Group Verse Notice */}
                          {(() => {
                            const currentTafsir = tafseers[ayah.number].tafsirs?.find(
                              t => t.author === selectedTafsirAuthor[ayah.number]
                            );
                            if (currentTafsir?.groupVerse) {
                              return (
                                <div className="mb-4 p-3 bg-amber-100 rounded-xl text-amber-800 text-sm">
                                  <strong>ℹ️ Note:</strong> {currentTafsir.groupVerse}
                                </div>
                              );
                            }
                            return null;
                          })()}

                          {/* Tafseer Content Display */}
                          <div className="text-[15px] leading-relaxed text-gray-700 prose prose-amber max-w-none">
                            {tafseers[ayah.number].tafsirs?.map((tafsir) => (
                              selectedTafsirAuthor[ayah.number] === tafsir.author && (
                                <div 
                                  key={tafsir.author}
                                  dangerouslySetInnerHTML={{ 
                                    __html: formatTafsirContent(tafsir.content) 
                                  }} 
                                />
                              )
                            ))}
                          </div>
                        </>
                      )
                    ) : (
                      <div className="flex items-center gap-3 py-8 text-amber-700">
                        <div className="animate-spin w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full" />
                        Loading Tafseer...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;