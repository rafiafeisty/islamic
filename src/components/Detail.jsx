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

  useEffect(() => {
    const fetchSurahDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const surahRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}`
        );
        const surahData = await surahRes.json();
        setSurahInfo(surahData.data);

        const arabicRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`
        );
        const arabicData = await arabicRes.json();

        const englishRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`
        );
        const englishData = await englishRes.json();

        const combined = arabicData.data.ayahs.map((ayah, i) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          english: englishData.data.ayahs[i]?.text || "",
        }));

        setAyahs(combined);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Surah data");
        setLoading(false);
      }
    };

    fetchSurahDetails();
  }, [surahNumber]);

  const playSurah = () => {
    if (!audioEnabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`
    );

    audioRef.current = audio;

    audio.play().catch((err) => {
      console.error("Audio error:", err);
      alert("Audio not supported or blocked by browser");
    });

    setPlaying(true);

    audio.onended = () => {
      setPlaying(false);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading Surah...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/surah")}
          style={{
            position: "absolute",
            left: "10px",
            top: "10px",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "clamp(12px, 2.5vw, 14px)",
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)" }}>
          {surahInfo?.name}
        </h1>

        <p style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>
          {surahInfo?.englishName} • {surahInfo?.numberOfAyahs} Ayahs
        </p>

        {/* Controls */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <button
            onClick={playSurah}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(12px, 2.5vw, 14px)",
            }}
          >
            🎵 Play
          </button>

          <button
            onClick={stopAudio}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(12px, 2.5vw, 14px)",
            }}
          >
            ⏹ Stop
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(12px, 2.5vw, 14px)",
            }}
          >
            {audioEnabled ? "🔊 ON" : "🔇 OFF"}
          </button>
        </div>
      </div>

      {/* AYAH LIST */}
      <div
        style={{
          padding: "clamp(15px, 4vw, 25px)",
          background: "#f8f9fa",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          {ayahs.map((ayah) => (
            <div
              key={ayah.number}
              style={{
                background: "white",
                marginBottom: "15px",
                padding: "clamp(12px, 3vw, 20px)",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              {/* number */}
              <div
                style={{
                  fontWeight: "bold",
                  color: "#28a745",
                  fontSize: "clamp(14px, 3vw, 16px)",
                }}
              >
                Ayah {ayah.number}
              </div>

              {/* Arabic */}
              <div
                style={{
                  fontSize: "clamp(20px, 5vw, 26px)",
                  textAlign: "right",
                  margin: "15px 0",
                  direction: "rtl",
                  fontFamily: "serif",
                  lineHeight: "1.8",
                }}
              >
                {ayah.arabic}
              </div>

              {/* translation */}
              <div
                style={{
                  color: "#555",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  lineHeight: "1.6",
                }}
              >
                {ayah.english}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;
