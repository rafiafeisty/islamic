import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pattern from '../images/pattern.png'

const Surah = () => {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://api.alquran.cloud/v1/surah')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch surahs');
                }
                return response.json();
            })
            .then(data => {
                setSurahs(data.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="mt-20 flex justify-center items-center min-h-screen p-5">
                <div className="text-center">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-5"></div>
                    <p className="text-green-600 text-sm sm:text-base">Loading Surahs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-20 flex justify-center items-center min-h-screen p-5">
                <div className="text-center text-red-600 bg-red-100 p-5 rounded-lg max-w-[90%] mx-5">
                    <h3 className="text-xl sm:text-2xl mb-2">Error Loading Surahs</h3>
                    <p className="text-sm sm:text-base mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-all text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="text-center text-emerald-700 justify-center items-center pt-16 pb-12 px-4 mt-14 grid gap-4">
                <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl mb-2">
                        Surah Al-Quran
                    </h1>
                    <p className="text-sm sm:text-base opacity-90">
                        {surahs.length} Chapters • The Holy Quran
                    </p>
                </div>
                <img
                    src={pattern}
                    alt="pattern"
                    className="mx-auto mt-8 opacity-75 w-48"
                />
            </div>

            {/* Surah Grid */}
            <div className="py-8 px-4 sm:px-6 min-h-[calc(100vh-200px)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {surahs.map((surah) => (
                            <div
                                key={surah.number}
                                onClick={() => navigate(`/surah/${surah.number}`)}
                                className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-[1px] border-emerald-400 overflow-hidden">
                                <div className="bg-emerald-600 text-white font-bold inline-block px-3 py-1 rounded-br-lg text-xs sm:text-sm">
                                    #{surah.number}
                                </div>

                                <div className="p-4 sm:p-5">
                                    <h3 className="text-right text-xl sm:text-2xl font-bold text-green-600 mb-2 font-arabic break-words">
                                        {surah.name}
                                    </h3>
                                    <h5 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 break-words">
                                        {surah.englishName}
                                    </h5>

                                    <p className="text-xs sm:text-sm text-gray-500 mb-2 break-words">
                                        {surah.englishNameTranslation}
                                    </p>

                                    {/* Details Footer */}
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 flex-wrap gap-2">
                                        <div className="bg-gray-100 px-2 py-1 rounded-full text-xs sm:text-sm text-emerald-600 font-medium">
                                            {surah.numberOfAyahs} Ayahs
                                        </div>

                                        <div className={`px-2 py-1 rounded-full text-xs sm:text-sm text-white font-medium ${surah.revelationType === 'Meccan' ? 'bg-amber-500' : 'bg-emerald-800'
                                            }`}>
                                            {surah.revelationType === 'Meccan' ? '🇲🇦 Makki' : '🇲🇩 Madni'}
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

export default Surah;