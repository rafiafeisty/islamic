import React, { useState, useEffect } from 'react'

const Calender = () => {
    const [currentDate] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        fetch(`https://api.aladhan.com/v1/gToH/${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`)
            .then(response => response.json())
            .catch(() => null)
    }, [currentDate])

    const islamicMonths = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ]

    const gregorianMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const islamicEvents = {
        'Muharram': ['1 - Islamic New Year', '10 - Day of Ashura'],
        'Rabi al-Awwal': ['12 - Mawlid al-Nabi (Prophet\'s Birthday)'],
        'Rajab': ['27 - Al-Isra\' wal-Mi\'raj'],
        'Sha\'ban': ['15 - Mid-Sha\'ban (Nisf Sha\'ban)'],
        'Ramadan': ['1 - First Day of Ramadan', '27 - Laylat al-Qadr (approx)'],
        'Shawwal': ['1 - Eid al-Fitr'],
        'Dhu al-Hijjah': ['9 - Day of Arafah', '10 - Eid al-Adha']
    }

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
        const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
        const days = []

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate() && 
                           selectedMonth === currentDate.getMonth() && 
                           selectedYear === currentDate.getFullYear()
            
            days.push(
                <div key={day} 
                     className="calendar-day"
                     style={{
                         backgroundColor: isToday ? '#28a745' : 'white',
                         color: isToday ? 'white' : '#333',
                         border: '1px solid #e9ecef',
                         padding: '10px',
                         textAlign: 'center',
                         cursor: 'pointer',
                         transition: 'all 0.3s ease',
                         borderRadius: '5px',
                         fontSize: 'clamp(12px, 4vw, 16px)'
                     }}
                     onMouseEnter={(e) => {
                         if (!isToday) {
                             e.currentTarget.style.backgroundColor = '#f8f9fa'
                             e.currentTarget.style.transform = 'scale(1.05)'
                         }
                     }}
                     onMouseLeave={(e) => {
                         if (!isToday) {
                             e.currentTarget.style.backgroundColor = 'white'
                             e.currentTarget.style.transform = 'scale(1)'
                         }
                     }}>
                    {day}
                </div>
            )
        }
        
        return days
    }

    const changeMonth = (increment) => {
        let newMonth = selectedMonth + increment
        let newYear = selectedYear
        
        if (newMonth < 0) {
            newMonth = 11
            newYear--
        } else if (newMonth > 11) {
            newMonth = 0
            newYear++
        }
        
        setSelectedMonth(newMonth)
        setSelectedYear(newYear)
    }

    return (
        <>
            {/* Hero Section */}
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
                    Islamic Calendar
                </h1>
                <p style={{ 
                    fontSize: 'clamp(14px, 4vw, 18px)', 
                    opacity: 0.9 
                }}>
                    Hijri Calendar 1445-1446 AH
                </p>
            </div>

            <div style={{ 
                padding: 'clamp(20px, 5vw, 40px) clamp(15px, 4vw, 20px)', 
                backgroundColor: '#f8f9fa' 
            }}>
                <div className="container" style={{ 
                    maxWidth: '1200px', 
                    margin: '0 auto',
                    padding: '0 clamp(10px, 3vw, 20px)'
                }}>
                    
                    {/* Current Date Cards */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'clamp(15px, 4vw, 20px)',
                        justifyContent: 'center',
                        marginBottom: 'clamp(30px, 6vw, 40px)'
                    }}>
                        <div style={{
                            flex: '1',
                            minWidth: 'clamp(250px, 80vw, 280px)',
                            background: 'white',
                            borderRadius: '15px',
                            padding: 'clamp(20px, 5vw, 25px)',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ 
                                color: '#28a745', 
                                marginBottom: '15px',
                                fontSize: 'clamp(16px, 4vw, 20px)'
                            }}>
                                Gregorian Date
                            </h3>
                            <p style={{ 
                                fontSize: 'clamp(16px, 5vw, 24px)', 
                                fontWeight: 'bold', 
                                color: '#333',
                                wordBreak: 'break-word'
                            }}>
                                {currentDate.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        
                        <div style={{
                            flex: '1',
                            minWidth: 'clamp(250px, 80vw, 280px)',
                            background: 'white',
                            borderRadius: '15px',
                            padding: 'clamp(20px, 5vw, 25px)',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ 
                                color: '#28a745', 
                                marginBottom: '15px',
                                fontSize: 'clamp(16px, 4vw, 20px)'
                            }}>
                                Hijri Date
                            </h3>
                            <p style={{ 
                                fontSize: 'clamp(16px, 5vw, 24px)', 
                                fontWeight: 'bold', 
                                color: '#333',
                                wordBreak: 'break-word'
                            }}>
                                1 {islamicMonths[new Date().getMonth()]} 1445 AH
                            </p>
                        </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'clamp(20px, 5vw, 30px)',
                        flexWrap: 'wrap',
                        gap: '15px'
                    }}>
                        <button onClick={() => changeMonth(-1)}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: 'clamp(8px, 3vw, 10px) clamp(15px, 4vw, 20px)',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(12px, 3.5vw, 16px)',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}>
                            ← Previous
                        </button>
                        
                        <h2 style={{ 
                            color: '#28a745', 
                            margin: 0,
                            fontSize: 'clamp(18px, 5vw, 24px)',
                            textAlign: 'center'
                        }}>
                            {gregorianMonths[selectedMonth]} {selectedYear}
                        </h2>
                        
                        <button onClick={() => changeMonth(1)}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: 'clamp(8px, 3vw, 10px) clamp(15px, 4vw, 20px)',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(12px, 3.5vw, 16px)',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}>
                            Next →
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div style={{
                        background: 'white',
                        borderRadius: '15px',
                        padding: 'clamp(15px, 4vw, 20px)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        marginBottom: 'clamp(30px, 6vw, 40px)',
                        overflowX: 'auto'
                    }}>
                        {/* Weekday Headers */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: 'clamp(3px, 2vw, 5px)',
                            marginBottom: '10px',
                            minWidth: '280px'
                        }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} style={{
                                    textAlign: 'center',
                                    padding: 'clamp(8px, 2vw, 10px)',
                                    fontWeight: 'bold',
                                    color: '#28a745',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '5px',
                                    fontSize: 'clamp(10px, 3vw, 14px)'
                                }}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        {/* Calendar Days */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: 'clamp(3px, 2vw, 5px)',
                            minWidth: '280px'
                        }}>
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* Islamic Events */}
                    <div style={{
                        background: 'white',
                        borderRadius: '15px',
                        padding: 'clamp(20px, 5vw, 25px)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ 
                            color: '#28a745', 
                            marginBottom: '20px', 
                            textAlign: 'center',
                            fontSize: 'clamp(18px, 5vw, 24px)'
                        }}>
                            Important Islamic Events
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 300px), 1fr))',
                            gap: '20px'
                        }}>
                            {Object.entries(islamicEvents).map(([month, events]) => (
                                <div key={month} style={{
                                    background: '#f8f9fa',
                                    padding: 'clamp(12px, 3vw, 15px)',
                                    borderRadius: '10px',
                                    borderLeft: `4px solid #28a745`
                                }}>
                                    <h4 style={{ 
                                        color: '#28a745', 
                                        marginBottom: '10px',
                                        fontSize: 'clamp(14px, 4vw, 18px)'
                                    }}>
                                        {month}
                                    </h4>
                                    <ul style={{ 
                                        margin: 0, 
                                        paddingLeft: 'clamp(15px, 4vw, 20px)' 
                                    }}>
                                        {events.map((event, index) => (
                                            <li key={index} style={{ 
                                                marginBottom: '5px', 
                                                color: '#666',
                                                fontSize: 'clamp(12px, 3vw, 14px)',
                                                wordBreak: 'break-word'
                                            }}>
                                                {event}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calender