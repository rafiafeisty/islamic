import React, { useEffect, useState } from "react";

const Prayer = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // You can change city/country if needed
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Shahodi%20Garhi&country=Pakistan&method=2"
        );

        const data = await response.json();
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
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          padding: "60px 20px",
          textAlign: "center",
          color: "white",
          marginTop: "56px",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          Prayer Timings
        </h1>
      </div>

      {/* Body */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="card shadow-sm border-success"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          {/* Header */}
          <div className="card-header bg-success text-white text-center">
            <h4 className="mb-0">Prayer Times</h4>
            <small>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </div>

          {/* Content */}
          <div className="card-body p-0">
            {loading ? (
              <p className="text-center p-3 mb-0">Loading prayer times...</p>
            ) : (
              <table className="table table-light table-bordered text-center mb-0">
                <thead className="table-success">
                  <tr>
                    <th>Prayer</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key) => (
                    <tr key={key}>
                      <td className="fw-semibold text-success">{key}</td>
                      <td className="fw-bold">{prayerTimes[key]}</td>
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