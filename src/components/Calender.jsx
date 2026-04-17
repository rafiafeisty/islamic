import React, { useState, useEffect } from 'react'
import pattern from '../images/pattern.png'

const Calender = () => {
    const [currentDate] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [hijriData, setHijriData] = useState({})
    const [loading, setLoading] = useState(false)

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

    const fetchHijriDate = async (day, month, year) => {
        try {
            const response = await fetch(
                `https://api.aladhan.com/v1/gToH/${day}-${month + 1}-${year}`
            )
            const data = await response.json()
            if (data.code === 200) {
                return {
                    day: data.data.hijri.day,
                    month: data.data.hijri.month.en,
                    year: data.data.hijri.year
                }
            }
        } catch (error) {
            console.error('Error fetching Hijri date:', error)
        }
        return null
    }

    useEffect(() => {
        const loadHijriDates = async () => {
            setLoading(true)
            const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
            const dates = {}

            for (let day = 1; day <= daysInMonth; day++) {
                const hijriDate = await fetchHijriDate(day, selectedMonth, selectedYear)
                if (hijriDate) {
                    dates[day] = hijriDate
                }
            }
            setHijriData(dates)
            setLoading(false)
        }

        loadHijriDates()
    }, [selectedMonth, selectedYear])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const getIslamicEvent = (hijriDay, hijriMonth) => {
        const monthEvents = islamicEvents[hijriMonth]
        if (!monthEvents) return null

        const event = monthEvents.find(event => {
            const eventDay = parseInt(event.split(' - ')[0])
            return eventDay === hijriDay
        })

        return event ? event.split(' - ')[1] : null
    }

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
        const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
        const days = []

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate() &&
                selectedMonth === currentDate.getMonth() &&
                selectedYear === currentDate.getFullYear()

            const hijriInfo = hijriData[day]
            const eventName = hijriInfo ? getIslamicEvent(parseInt(hijriInfo.day), hijriInfo.month) : null

            days.push(
                <div
                    key={day}
                    className={`p-2 text-center transition-all duration-300 rounded-lg flex flex-col justify-center min-h-[60px] sm:min-h-[80px] border-[1px] border-emerald-700 ${isToday ? 'bg-emerald-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50 hover:scale-105'
                        }`}
                >
                    <div className="font-bold text-sm sm:text-base mb-1">
                        {day}
                    </div>
                    {hijriInfo && (
                        <div className={`text-xs ${isToday ? 'text-gray-200' : 'text-gray-500'} mb-0.5`}>
                            {hijriInfo.day} {hijriInfo.month.substring(0, 3)}
                        </div>
                    )}
                    {eventName && (
                        <div className="text-xs bg-yellow-400 text-gray-800 px-1 py-0.5 rounded mt-1 truncate font-medium">
                            {eventName}
                        </div>
                    )}
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

    const [currentHijri, setCurrentHijri] = useState(null)
    useEffect(() => {
        const getCurrentHijri = async () => {
            const hijri = await fetchHijriDate(
                currentDate.getDate(),
                currentDate.getMonth(),
                currentDate.getFullYear()
            )
            setCurrentHijri(hijri)
        }
        getCurrentHijri()
    }, [])

    return (
        <>
            {/* Header */}
            <div className="grid justify-center text-center items-center text-emerald-700 pt-16 px-4 mt-14">
                <h1 className="text-4xl sm:text-5xl md:text-6xl mb-2">
                    Islamic Calendar
                </h1>
                <p className="text-center text-sm sm:text-base opacity-90">
                    Hijri {currentHijri?.year || '1445-1446'} AH
                </p>
                <img
                    src={pattern}
                    alt="pattern"
                    className="mx-auto mt-8 opacity-75 w-48"
                />
            </div>

            {/* Main Content */}
            <div className="bg-gray-100 py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Date Cards */}
                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                        <div className="flex-1 min-w-[250px] rounded-xl p-5 text-center border-2 border-emerald-700">
                            <h3 className="text-green-600 mb-3 text-base sm:text-lg font-semibold">
                                Gregorian Date
                            </h3>
                            <p className="text-base sm:text-xl font-bold text-gray-800">
                                {currentDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="flex-1 min-w-[250px] rounded-xl p-5 text-center border-2 border-emerald-700">
                            <h3 className="text-emerald-600 mb-3 text-base sm:text-lg font-semibold">
                                Hijri Date
                            </h3>
                            <p className="text-base sm:text-xl font-bold text-gray-800">
                                {currentHijri ? `${currentHijri.day} ${currentHijri.month} ${currentHijri.year} AH` : 'Loading...'}
                            </p>
                        </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="bg-emerald-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-emerald-700 transition-all text-sm sm:text-base"
                        >
                            ← Previous
                        </button>

                        <h2 className="text-emerald-600 text-xl sm:text-2xl font-bold text-center">
                            {gregorianMonths[selectedMonth]} {selectedYear}
                        </h2>

                        <button
                            onClick={() => changeMonth(1)}
                            className="bg-emerald-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-emerald-700 transition-all text-sm sm:text-base"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    {loading ? (
                        <div className="text-center py-10">
                            Loading Islamic calendar...
                        </div>
                    ) : (
                        <div className="rounded-xl p-4 border-[1px] border-emerald-900 overflow-x-auto mb-8">
                            <div className="grid grid-cols-7 gap-1 mb-2 min-w-[280px]">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center p-2 font-bold text-emerald-600 bg-gray-100 rounded-lg text-xs sm:text-sm">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 min-w-[280px]">
                                {renderCalendar()}
                            </div>
                        </div>
                    )}

                    {/* Islamic Events */}
                    <div className="bg-white rounded-xl p-5 border-[1px] border-emerald-900">
                        <h3 className="text-emerald-600 mb-4 text-center text-xl sm:text-2xl font-bold">
                            Important Islamic Events
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(islamicEvents).map(([month, events]) => (
                                <div key={month} className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-600">
                                    <h4 className="text-emerald-600 mb-2 text-sm sm:text-base font-semibold">
                                        {month}
                                    </h4>
                                    <ul className="pl-5 space-y-1">
                                        {events.map((event, index) => (
                                            <li key={index} className="text-gray-600 text-xs sm:text-sm">
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