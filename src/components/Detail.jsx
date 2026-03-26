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

        // Surah info
        const surahRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}`
        );
        const surahData = await surahRes.json();
        setSurahInfo(surahData.data);

        // Arabic text
        const arabicRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`
        );
        const arabicData = await arabicRes.json();

        // English translation
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

  // 🔊 FIXED AUDIO (SURAH LEVEL)
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
          padding: "40px",
          marginTop: "56px",
          position: "relative",
        }}
      >
        <button
          onClick={() => navigate("/surah")}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            padding: "8px 15px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1>{surahInfo?.name}</h1>
        <p>
          {surahInfo?.englishName} • {surahInfo?.numberOfAyahs} Ayahs
        </p>

        <div style={{ marginTop: "10px" }}>
          <button
            onClick={playSurah}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            🎵 Play Surah
          </button>

          <button
            onClick={stopAudio}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⏹ Stop
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            style={{
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {audioEnabled ? "🔊 ON" : "🔇 OFF"}
          </button>
        </div>
      </div>

      {/* AYAH LIST */}
      <div style={{ padding: "20px", background: "#f8f9fa" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          {ayahs.map((ayah) => (
            <div
              key={ayah.number}
              style={{
                background: "white",
                marginBottom: "15px",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              {/* number */}
              <div style={{ fontWeight: "bold", color: "#28a745" }}>
                Ayah {ayah.number}
              </div>

              {/* Arabic */}
              <div
                style={{
                  fontSize: "26px",
                  textAlign: "right",
                  margin: "15px 0",
                  direction: "rtl",
                  fontFamily: "serif",
                }}
              >
                {ayah.arabic}
              </div>

              {/* translation */}
              <div style={{ color: "#555" }}>{ayah.english}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;