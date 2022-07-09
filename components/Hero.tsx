function Hero() {
    return (
        <div className="flex items-center justify-between bg-yellow-300 border-y 
        border-black py-10 lg:py-0 max-w-7xl mx-auto" >
            <div className="px-10 space-y-5">
                <h1 className="text-6xl max-w-xl">
                    Share your thoughts, speak your mind.
                </h1>
                <h2>
                    Change the world around you. your words carry the essence of your experience.
                </h2>
            </div>
            <img className="hidden md:inline-flex h-32 lg:h-full" src="/hero2.jpg" alt="" />
        </div>
    )
}

export default Hero