import React from 'react'
import home from '../images/home.png'

const Home = () => {
    const cardData = [
        { title: 'Para', value: 30, subtitle: 'Total Paras in Quran', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
        { title: 'Surah', value: 114, subtitle: 'Total Surahs in Quran', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
        { title: 'Ayat', value: 6666, subtitle: 'Total Ayats in Quran', color: 'bg-teal-500', textColor: 'text-teal-500' },
        { title: 'Juz', value: 30, subtitle: 'Total Juz in Quran', color: 'bg-teal-500', textColor: 'text-teal-500' }
    ]

    return (
        <>
            {/* Hero Image */}
            <div className="w-full overflow-hidden relative">
                <img
                    src={home}
                    alt="mosque"
                    className="w-full block shadow-lg shadow-slate-900/30"
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10'></div>
            </div>

            {/* Cards Section */}
            <div className="container mx-auto my-12 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {cardData.map((card, index) => (
                        <div
                            key={index}
                            className="group relative bg-white shadow-lg hover:shadow-2xl 
                                       transition-all duration-500 hover:-translate-y-3 
                                       w-full aspect-square max-w-[260px] mx-auto 
                                       rounded-full overflow-hidden border border-emerald-100"
                        >
                            {/* Semi-Circle - Top half of the circle */}
                            <div className={`absolute ${card.color} transition-all duration-500 group-hover:scale-105`}
                                 style={{
                                     top: 0,
                                     left: 0,
                                     right: 0,
                                     height: '50%',
                                     borderRadius: '50% 50% 0 0',
                                 }} />

                            {/* Inner decorative circle */}
                            <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm" />

                            {/* Main Content */}
                            <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                                {/* Big Number on Semi-circle */}
                                <div className="text-white text-5xl font-bold tracking-tighter mt-16 z-10">
                                    {card.value}
                                </div>

                                {/* Title */}
                                <h5 className="text-xl font-semibold text-slate-800 mt-10 mb-1">
                                    {card.title}
                                </h5>

                                {/* Subtitle */}
                                <p className="text-slate-500 text-[13px] px-6 leading-tight">
                                    {card.subtitle}
                                </p>

                                {/* Bottom Accent Number */}
                                <p className={`mt-6 mb-8 text-3xl font-bold ${card.textColor}`}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home