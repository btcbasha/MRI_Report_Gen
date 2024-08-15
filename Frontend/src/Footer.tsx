
const Footer= () => {
    return (
        <footer className="bg-white py-10 mt-[10rem] lg:mt-[35rem]">
            <div className="container mx-auto  px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-24 text-center md:text-left">
                    <div>
                        <h4 className="text-xl font-bold text-blue-700">Technology</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Doctor to Patient Translator</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">ERAdvisor ROI Calculator</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Product Guide</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Status</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-blue-700">Products</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">ERAdvisor</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">CareAdvisor</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">AccessAdvisor</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">CareAssist</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-blue-700">Company</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Newsroom</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Diversity</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Careers</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-blue-700">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms & Conditions</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Code of Conduct</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-500">
                    © ekonik health 2024
                </div>
            </div>
        </footer>
    );
};

export default Footer;
