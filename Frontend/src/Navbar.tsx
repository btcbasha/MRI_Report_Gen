
const Navbar =() => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="bg-blue-600 text-white text-center py-2 text-sm">
                <a href="#" className="hover:underline">
                    ERAdvisor Earns Top Marks in KLAS Spotlight Report →
                </a>
            </div>
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-blue-700 text-2xl font-bold">
                    ekonik health
                    </a>
                    <div className="hidden md:flex space-x-8">
                        <div className="relative group">
                            <button className="text-blue-700 font-semibold">Products</button>
                            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border shadow-lg py-2 w-40">
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Product 1</a>
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Product 2</a>
                            </div>
                        </div>
                        <div className="relative group">
                            <button className="text-blue-700 font-semibold">Solutions</button>
                            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border shadow-lg py-2 w-40">
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Solution 1</a>
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Solution 2</a>
                            </div>
                        </div>
                        <a href="#" className="text-blue-700 font-semibold">Resources</a>
                        <div className="relative group">
                            <button className="text-blue-700 font-semibold">Technology</button>
                            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border shadow-lg py-2 w-40">
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tech 1</a>
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tech 2</a>
                            </div>
                        </div>
                        <a href="#" className="text-blue-700 font-semibold">Newsroom</a>
                    </div>
                </div>
                <div>
                    <a
                        href="#"
                        className="bg-lime-300 text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-lime-400 transition duration-300"
                    >
                        Request a Demo
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
