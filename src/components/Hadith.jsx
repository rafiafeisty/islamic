import React, { useState, useEffect } from 'react';
import pattern from '../images/pattern.png';

const Hadith = () => {
  const [hadithinfo, setHadithInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHadith = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.ummahapi.com/api/hadith/bukhari?page=${page}&limit=8`
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const res = await response.json();
        setHadithInfo(res.data?.hadiths || []);
      } catch (error) {
        console.error("Error:", error);
        setHadithInfo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHadith();
  }, [page]);

  return (
    <>
      {/* Header */}
      <div className="text-center text-emerald-700 pt-16 pb-12 px-4 mt-14">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
          Hadith
        </h1>
        <p className="text-emerald-600 text-lg">Sahih al-Bukhari</p>
        <img 
          src={pattern} 
          alt="pattern" 
          className="mx-auto mt-8 opacity-75 w-48" 
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-emerald-700 mt-4">Loading Hadiths...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {hadithinfo.map((hadith) => (
              <div
                key={hadith.id}
                className="rounded-3xl p-8 border-[1px] border-emerald-700"
              >
                {/* Hadith Number */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {hadith.hadithnumber}
                  </div>
                  <div>
                    <p className="font-medium text-emerald-700">Sahih al-Bukhari</p>
                    <p className="text-xs text-gray-500">Hadith {hadith.hadithnumber}</p>
                  </div>
                </div>

                {/* Arabic Text */}
                <div 
                  className="text-right text-2xl sm:text-3xl leading-relaxed font-serif text-gray-800 mb-8 border-b-slate-700/20 border-b-[1px] pb-4" 
                  dir="rtl"
                >
                  {hadith.arabic}
                </div>

                {/* English Translation */}
                <div className="text-gray-700 leading-relaxed border-t border-gray-100 pt-7 text-[15.5px]">
                  {hadith.english}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Pagination */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-7 py-3 bg-white border border-emerald-700 text-emerald-700 rounded-2xl hover:bg-emerald-50 transition disabled:opacity-50"
          >
            ← Previous
          </button>

          <span className="text-lg font-semibold text-emerald-800 px-4">
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-7 py-3 bg-emerald-700 text-white rounded-2xl hover:bg-emerald-800 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
};

export default Hadith;