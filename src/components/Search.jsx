import React from 'react'
import pattern from '../images/pattern.png'
import { useState, useEffect } from 'react'

const Search = () => {
    const [allSurahs, setAllSurahs] = useState([]);
    const [searchType, setSearchType] = useState('surah'); // 'surah', 'quran', 'hadith'
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Results states
    const [surahResults, setSurahResults] = useState(null);
    const [quranResults, setQuranResults] = useState([]);
    const [hadithResults, setHadithResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    
    // For surah selection
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahDetails, setSurahDetails] = useState(null);

    // Fetch all surahs on component mount
    useEffect(() => {
        const fetchAllSurahs = async () => {
            try {
                const data = await fetch("https://api.alquran.cloud/v1/surah");
                if (!data.ok) throw new Error("Failed to fetch surahs");
                const res = await data.json();
                setAllSurahs(res.data);
            } catch (err) {
                console.error("Error fetching surahs:", err);
                setError("Failed to load surah list");
            }
        };
        fetchAllSurahs();
    }, []);

    // Search by Surah Name
    const searchBySurahName = async () => {
        if (!query.trim()) {
            setError("Please enter a surah name");
            return;
        }
        
        setLoading(true);
        setError(null);
        setSurahResults(null);
        setQuranResults([]);
        setHadithResults([]);
        
        try {
            // Find matching surahs (case-insensitive search)
            const matches = allSurahs.filter(surah => 
                surah.englishName.toLowerCase().includes(query.toLowerCase()) ||
                surah.name.toLowerCase().includes(query.toLowerCase()) ||
                (surah.englishNameTranslation && surah.englishNameTranslation.toLowerCase().includes(query.toLowerCase()))
            );
            
            if (matches.length > 0) {
                setSurahResults(matches);
                setSearchPerformed(true);
            } else {
                setError(`No surah found matching "${query}"`);
                setSearchPerformed(true);
            }
        } catch (err) {
            setError("Error searching surahs");
        } finally {
            setLoading(false);
        }
    };

    // Fetch full surah details when a surah is selected
    const fetchSurahDetails = async (surahNumber) => {
        setLoading(true);
        try {
            const [arabicRes, englishRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
                fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`)
            ]);
            
            const arabicData = await arabicRes.json();
            const englishData = await englishRes.json();
            
            setSelectedSurah(surahNumber);
            setSurahDetails({
                info: allSurahs.find(s => s.number === surahNumber),
                ayahs: arabicData.data.ayahs.map((ayah, i) => ({
                    number: ayah.numberInSurah,
                    arabic: ayah.text,
                    english: englishData.data.ayahs[i]?.text || ""
                }))
            });
        } catch (err) {
            setError("Failed to load surah details");
        } finally {
            setLoading(false);
        }
    };

    // Search Quran by keyword - FIXED: Properly handle the response structure
    const searchQuran = async () => {
        if (!query.trim()) {
            setError("Please enter a search term");
            return;
        }
        
        setLoading(true);
        setError(null);
        setQuranResults([]);
        setSurahResults(null);
        setSelectedSurah(null);
        
        try {
            const response = await fetch(`https://www.ummahapi.com/api/quran/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Search failed");
            const res = await response.json();
            
            console.log("Quran API Response:", res); // Debug log
            
            // Check the response structure - results are in data.results
            if (res.success && res.data && res.data.results && res.data.results.length > 0) {
                setQuranResults(res.data.results);
                setSearchPerformed(true);
            } else {
                setError(`No Quranic verses found matching "${query}"`);
                setSearchPerformed(true);
            }
        } catch (err) {
            console.error("Quran search error:", err);
            setError("Failed to search Quran. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Search Hadith - FIXED: Properly handle the response structure
    const searchHadith = async () => {
        if (!query.trim()) {
            setError("Please enter a search term");
            return;
        }
        
        setLoading(true);
        setError(null);
        setHadithResults([]);
        setSurahResults(null);
        setSelectedSurah(null);
        
        try {
            const response = await fetch(`https://www.ummahapi.com/api/hadith/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Search failed");
            const res = await response.json();
            
            console.log("Hadith API Response:", res); // Debug log
            
            // Check the response structure - hadiths are in data.hadiths
            if (res.success && res.data && res.data.hadiths && res.data.hadiths.length > 0) {
                setHadithResults(res.data.hadiths);
                setSearchPerformed(true);
            } else {
                setError(`No hadith found matching "${query}"`);
                setSearchPerformed(true);
            }
        } catch (err) {
            console.error("Hadith search error:", err);
            setError("Failed to search Hadith. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchType === 'surah') {
            searchBySurahName();
        } else if (searchType === 'quran') {
            searchQuran();
        } else {
            searchHadith();
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSurahResults(null);
        setQuranResults([]);
        setHadithResults([]);
        setSelectedSurah(null);
        setSurahDetails(null);
        setSearchPerformed(false);
        setError(null);
    };

    const goBackToResults = () => {
        setSelectedSurah(null);
        setSurahDetails(null);
    };

    return (
        <>
            <div className="text-center text-emerald-700 pt-16 pb-12 px-4 mt-14">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
                    Search
                </h1>
                <p className="text-emerald-600 text-lg">Search about Surah or Hadith</p>
                <img
                    src={pattern}
                    alt="pattern"
                    className="mx-auto mt-8 opacity-75 w-48"
                />
            </div>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto px-4 mb-8">
                <div className="bg-white rounded-2xl p-6 border-[1px] border-emerald-700">
                    {/* Search Type Tabs */}
                    <div className="flex gap-2 mb-6 bg-emerald-50 p-1 rounded-xl">
                        <button
                            onClick={() => {
                                setSearchType('surah');
                                clearSearch();
                            }}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                searchType === 'surah'
                                    ? 'bg-emerald-700 text-white shadow-md'
                                    : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            📖 Search by Surah
                        </button>
                        <button
                            onClick={() => {
                                setSearchType('quran');
                                clearSearch();
                            }}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                searchType === 'quran'
                                    ? 'bg-emerald-700 text-white shadow-md'
                                    : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            🔍 Search Quran
                        </button>
                        <button
                            onClick={() => {
                                setSearchType('hadith');
                                clearSearch();
                            }}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                searchType === 'hadith'
                                    ? 'bg-emerald-700 text-white shadow-md'
                                    : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            📜 Search Hadith
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={
                                searchType === 'surah' 
                                    ? "Enter surah name (e.g., 'Al-Fatiha', 'Maryam')..." 
                                    : searchType === 'quran'
                                    ? "Search Quran by word or phrase..."
                                    : "Search Hadith by keyword..."
                            }
                            className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-gray-700"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        {searchPerformed && !selectedSurah && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-emerald-600">Searching...</p>
                    </div>
                )}

                {/* Surah Search Results */}
                {!loading && searchPerformed && searchType === 'surah' && !selectedSurah && surahResults && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                            Found {surahResults.length} Surah{surahResults.length !== 1 ? 's' : ''}
                        </h2>
                        <div className="grid gap-4">
                            {surahResults.map((surah) => (
                                <div
                                    key={surah.number}
                                    onClick={() => fetchSurahDetails(surah.number)}
                                    className="bg-white rounded-xl border-2 border-emerald-200 p-5 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-400"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                    #{surah.number}
                                                </span>
                                                <span className="text-gray-500 text-sm">
                                                    {surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">{surah.englishName}</h3>
                                            <p className="text-emerald-600">{surah.englishNameTranslation}</p>
                                            <p className="text-sm text-gray-500 mt-1">{surah.numberOfAyahs} Ayahs</p>
                                        </div>
                                        <div className="text-right" dir="rtl">
                                            <span className="text-2xl font-serif text-gray-700">{surah.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Surah Details View */}
                {selectedSurah && surahDetails && (
                    <div className="mt-8">
                        <button
                            onClick={goBackToResults}
                            className="mb-4 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                            ← Back to results
                        </button>
                        <div className="bg-white rounded-xl border border-emerald-200 p-6">
                            <div className="text-center pb-6 border-b border-emerald-100 mb-6">
                                <h2 className="text-3xl font-bold text-emerald-800">{surahDetails.info.englishName}</h2>
                                <p className="text-emerald-600">{surahDetails.info.englishNameTranslation}</p>
                                <div className="text-right mt-2" dir="rtl">
                                    <span className="text-2xl font-serif text-gray-700">{surahDetails.info.name}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {surahDetails.ayahs.map((ayah) => (
                                    <div key={ayah.number} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="text-sm text-emerald-600 mb-2">Ayah {ayah.number}</div>
                                        <div className="text-right text-xl font-serif leading-loose text-gray-800 mb-3" dir="rtl">
                                            {ayah.arabic}
                                        </div>
                                        <div className="text-gray-600 text-sm leading-relaxed">
                                            {ayah.english}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quran Search Results - FIXED: Use correct data structure */}
                {!loading && searchPerformed && searchType === 'quran' && quranResults.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                            Found {quranResults.length} Result{quranResults.length !== 1 ? 's' : ''}
                        </h2>
                        <div className="space-y-4">
                            {quranResults.map((result, index) => (
                                <div key={index} className="bg-white rounded-xl border border-emerald-200 p-5 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-semibold">
                                            Surah {result.surah_number || result.surah}:{result.ayah}
                                        </span>
                                        <span className="text-emerald-600 text-xs">
                                            {result.surah_name}
                                        </span>
                                    </div>
                                    <div className="text-right text-xl font-serif leading-loose text-gray-800 mb-3" dir="rtl">
                                        {result.arabic}
                                    </div>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {result.translation}
                                    </div>
                                    {result.matched_in && (
                                        <div className="mt-2 text-xs text-emerald-500">
                                            Matched in: {result.matched_in}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hadith Search Results - FIXED: Use correct data structure */}
                {!loading && searchPerformed && searchType === 'hadith' && hadithResults.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                            Found {hadithResults.length} Hadith{hadithResults.length !== 1 ? 's' : ''}
                        </h2>
                        <div className="space-y-4">
                            {hadithResults.map((hadith, index) => (
                                <div key={hadith.id || index} className="bg-white rounded-xl border border-emerald-200 overflow-hidden hover:shadow-md transition-all">
                                    <div className="bg-emerald-50 p-4 border-b border-emerald-200">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {hadith.hadithnumber && (
                                                <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded text-xs font-semibold">
                                                    Hadith #{hadith.hadithnumber}
                                                </span>
                                            )}
                                            {hadith.collection_name && (
                                                <span className="text-emerald-600 text-sm">{hadith.collection_name}</span>
                                            )}
                                        </div>
                                    </div>
                                    {hadith.arabic && (
                                        <div className="p-5 text-right text-xl font-serif leading-loose text-gray-800 border-b border-gray-100" dir="rtl">
                                            {hadith.arabic}
                                        </div>
                                    )}
                                    <div className="p-5">
                                        {hadith.english && (
                                            <div className="text-gray-700 leading-relaxed mb-3">
                                                {hadith.english}
                                            </div>
                                        )}
                                        {hadith.grade && (
                                            <div className="text-sm text-emerald-600 mt-2">
                                                Grade: {hadith.grade}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && searchPerformed && 
                 ((searchType === 'surah' && !selectedSurah && (!surahResults || surahResults.length === 0)) ||
                  (searchType === 'quran' && quranResults.length === 0 && !error) ||
                  (searchType === 'hadith' && hadithResults.length === 0 && !error)) && (
                    <div className="text-center py-12 text-gray-500">
                        No results found for "{query}"
                    </div>
                )}
            </div>
        </>
    )
}

export default Search