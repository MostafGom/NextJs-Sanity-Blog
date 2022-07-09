import Link from "next/link"

function Header() {
    return (
        <header className="flex items-center justify-between p-5 max-w-7xl mx-auto">
            <div className="flex items-center space-x-5">
                <Link href="/" >
                    <img className="w-24 object-contain cursor-pointer rounded-full"
                        src="/logo3.png" alt="" />
                </Link>
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="text-black bg-yellow-300 px-4 py-1 rounded-full">Follow</h3>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-yellow-600">
                <h3>Sign In</h3>
                <h3 className="border px-4 py-1 rounded-full border-yellow-300">Get Started</h3>
            </div>
        </header>
    )
}

export default Header