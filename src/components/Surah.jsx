import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Surah = () => {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all surahs from API
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
            <div style={{
                marginTop: "76px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "20px"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: "clamp(40px, 8vw, 50px)",
                        height: "clamp(40px, 8vw, 50px)",
                        border: "5px solid #f3f3f3",
                        borderTop: "5px solid #28a745",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 20px"
                    }} />
                    <p style={{ 
                        color: "#28a745",
                        fontSize: "clamp(14px, 4vw, 16px)"
                    }}>
                        Loading Surahs...
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                marginTop: "76px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "20px"
            }}>
                <div style={{
                    textAlign: "center",
                    color: "red",
                    backgroundColor: "#f8d7da",
                    padding: "clamp(15px, 5vw, 20px)",
                    borderRadius: "10px",
                    maxWidth: "90%",
                    margin: "0 20px"
                }}>
                    <h3 style={{
                        fontSize: "clamp(18px, 5vw, 24px)",
                        marginBottom: "10px"
                    }}>
                        Error Loading Surahs
                    </h3>
                    <p style={{
                        fontSize: "clamp(14px, 4vw, 16px)",
                        marginBottom: "15px"
                    }}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "clamp(8px, 3vw, 10px) clamp(15px, 5vw, 20px)",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "clamp(14px, 4vw, 16px)"
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                padding: 'clamp(40px, 10vw, 60px) 20px',
                textAlign: 'center',
                color: 'white',
                marginTop: '56px'
            }}>
                <h1 style={{ 
                    fontSize: 'clamp(32px, 8vw, 48px)', 
                    marginBottom: '10px' 
                }}>
                    Surah Al-Quran
                </h1>
                <p style={{ 
                    fontSize: 'clamp(14px, 4vw, 18px)', 
                    opacity: 0.9 
                }}>
                    {surahs.length} Chapters • The Holy Quran
                </p>
            </div>

            {/* Surah Grid */}
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
                    {surahs.map((surah) => (
                        <div
                            key={surah.number}
                            onClick={() => navigate(`/surah/${surah.number}`)}
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
                            {/* Surah Number Badge */}
                            <div style={{
                                backgroundColor: '#28a745',
                                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 15px)',
                                display: 'inline-block',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '0 0 10px 0',
                                fontSize: 'clamp(12px, 3.5vw, 14px)'
                            }}>
                                #{surah.number}
                            </div>

                            <div style={{ 
                                padding: 'clamp(15px, 4vw, 20px)' 
                            }}>
                                {/* Surah Name in Arabic */}
                                <h3 style={{
                                    fontSize: 'clamp(20px, 6vw, 24px)',
                                    fontWeight: 'bold',
                                    color: '#28a745',
                                    marginBottom: '10px',
                                    textAlign: 'right',
                                    fontFamily: 'traditional arabic, "Amiri", serif',
                                    wordBreak: 'break-word'
                                }}>
                                    {surah.name}
                                </h3>

                                {/* Surah Name in English */}
                                <h5 style={{
                                    fontSize: 'clamp(16px, 4.5vw, 18px)',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '15px',
                                    wordBreak: 'break-word'
                                }}>
                                    {surah.englishName}
                                </h5>

                                <p style={{
                                    fontSize: 'clamp(12px, 3.5vw, 14px)',
                                    color: '#6c757d',
                                    marginBottom: '10px',
                                    wordBreak: 'break-word'
                                }}>
                                    {surah.englishNameTranslation}
                                </p>

                                {/* Surah Details */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '15px',
                                    paddingTop: '15px',
                                    borderTop: '1px solid #e9ecef',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: 'clamp(4px, 2vw, 5px) clamp(10px, 3vw, 12px)',
                                        borderRadius: '20px',
                                        fontSize: 'clamp(12px, 3.5vw, 14px)',
                                        color: '#28a745',
                                        fontWeight: '500'
                                    }}>
                                        {surah.numberOfAyahs} Ayahs
                                    </div>

                                    <div style={{
                                        backgroundColor: surah.revelationType === 'Meccan' ? '#ffc107' : '#17a2b8',
                                        padding: 'clamp(4px, 2vw, 5px) clamp(10px, 3vw, 12px)',
                                        borderRadius: '20px',
                                        fontSize: 'clamp(10px, 3vw, 12px)',
                                        color: 'white',
                                        fontWeight: '500'
                                    }}>
                                        {surah.revelationType === 'Meccan' ? '🇲🇦 Makki' : '🇲🇩 Madni'}
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
                    القرآن الكريم • The Holy Quran • {surahs.length} Surahs
                </p>
            </div>
        </>
    );
};

export default Surah;