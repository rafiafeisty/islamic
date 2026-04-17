import React, { useEffect, useState } from "react";
import pattern from '../images/pattern.png';

const Prayer = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Shahodi%20Garhi&country=Pakistan&method=2"
        );

        const data = await response.json();
        console.log(data)
        setPrayerTimes(data.data.timings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  return (
    <>
      <div className="justify-center grid items-center mt-16">
        <div className="text-center mt-14">
          <h1 className="text-emerald-700 text-4xl sm:text-5xl md:text-6xl">Prayer Time</h1>
        </div>
        <img
          src={pattern}
          alt="pattern"
          className="mx-auto mt-8 opacity-75 w-48"
        />
      </div>
      <div className="min-h-[80vh] flex justify-center items-center px-4 py-8">
        <div className="bg-white rounded-lg border-[1px] border-emerald-900 w-full max-w-md overflow-hidden">
          {/* Card Header */}
          <div className=" text-center bg-emerald-700 p-4">
            <h4 className="text-2xl font-bold mb-1">Prayer Times</h4>
            <small className="text-sm opacity-90">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </div>
          <div className="p-0">
            {loading ? (
              <p className="text-center p-4 mb-0 text-gray-600">
                Loading prayer times...
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-100">
                    <th className="p-3 text-green-700 font-semibold border border-gray-200">
                      Prayer
                    </th>
                    <th className="p-3 text-green-700 font-semibold border border-gray-200">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="p-3 text-green-600 font-medium border border-gray-200">
                        {key}
                      </td>
                      <td className="p-3 font-bold text-gray-800 border border-gray-200">
                        {prayerTimes[key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Prayer;