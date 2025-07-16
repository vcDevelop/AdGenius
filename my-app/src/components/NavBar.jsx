import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Pricing from "./Pricing";
import Auth from "./Auth";

export default function Navbar({ setCurrentPage, user, setUser, isPopupOpen, setPopupOpen }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    
    
    const fadeIn = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // or navigate("/") if using React Router
};

    return (
        <>
            {/* Navbar */}
            <nav className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-md py-3 px-6 flex justify-between items-center z-50 h-16">
                <a href="/">
  <h3 className="text-lg font-bold text-gray-900 cursor-pointer">AdGenius</h3>
</a>
                <div className="hidden md:flex space-x-8 text-lg font-medium">
                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        Features
                    </a>
                    <a
                        onClick={() => setCurrentPage('pricing')}
                        className="text-gray-700 hover:text-blue-600 cursor-pointer"
                        href="#"
                    >
                        Pricing
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        Support
                    </a>
                </div>
                {user ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Hi, {user.firstName}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-5 py-2 rounded-full shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setPopupOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-md hidden md:block"
                    >
                        Sign In
                    </button>
                )}
                <button
                    className="md:hidden text-black"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-lg shadow-md flex flex-col items-center py-4 z-40 md:hidden gap-y-4"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <a href="#" className="text-gray-700 hover:text-blue-600">
                            Features
                        </a>
                        <a
                            onClick={() => setCurrentPage('pricing')}
                            className="text-gray-700 hover:text-blue-600 cursor-pointer"
                            href="#"
                        >
                            Pricing
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600">
                            Support
                        </a>
                        <button
                            onClick={() => setPopupOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md"
                        >
                            Sign In
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

           <Auth
  isPopupOpen={isPopupOpen}
  isSignUp={isSignUp}
  error={error}
  onClose={() => setPopupOpen(false)} // this handles closing
/>

        </>
    );
}