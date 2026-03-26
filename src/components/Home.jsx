import React from 'react'
import home from '../images/home.png'

const Home = () => {
    const cardData = [
        { title: 'Para', value: 30, subtitle: 'Total Paras in Quran', color: '#28a745' },
        { title: 'Surah', value: 114, subtitle: 'Total Surahs in Quran', color: '#198754' },
        { title: 'Ayat', value: 6666, subtitle: 'Total Ayats in Quran', color: '#20c997' }
    ]

    return (
        <>
            <div style={{ width: '100%', overflow: 'hidden', marginTop: '56px' }}>
                <img
                    src={home}
                    alt="mosque"
                    style={{
                        width: '100%',
                        display: 'block'
                    }}
                />
            </div>

            <div className="container my-5">
                <div className="row g-4">
                    {cardData.map((card, index) => (
                        <div className="col-md-4 col-sm-6 col-12" key={index}>
                            <div className="card h-100 border-0 shadow-lg" 
                                 style={{ 
                                     borderRadius: '15px',
                                     transition: 'transform 0.3s ease',
                                     cursor: 'pointer'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="card-body text-center p-4">
                                    <div style={{
                                        backgroundColor: card.color,
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px auto',
                                        color: 'white',
                                        fontSize: '28px',
                                        fontWeight: 'bold'
                                    }}>
                                        {card.value}
                                    </div>
                                    <h5 className="card-title" style={{ color: card.color, fontWeight: 'bold' }}>
                                        {card.title}
                                    </h5>
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        {card.subtitle}
                                    </h6>
                                    <p className="card-text" style={{ fontSize: '48px', fontWeight: 'bold', color: card.color }}>
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home