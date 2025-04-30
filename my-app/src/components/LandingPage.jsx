import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdCreation from "./AdCreation";
import GenerateContent from "./GenerateContent";
import CreateCampaign from "./CreateCampaign";
import SelectCategory from "./SelectCategory";
import Pricing from "./Pricing";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const popUpAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const renderCard = () => {
    switch (selectedCard) {
      case "Distribution":
        return <AdCreation />;
      case "Generate Content":
        return <GenerateContent />;
      case "Create Campaign":
        return <CreateCampaign />;
      case "Register (Ad) Place":
        return <SelectCategory />;
      case "Pricing": 
        return <Pricing />;
      default:
        return null;
    }
  };

  const cardData = [
    { 
      title: "Distribution",
      description: "Optimize and automate ad distribution across multiple platforms."
    },
    { 
      title: "Create Campaign",
      description: "Effortlessly set up, manage, and track ad campaigns in one place."
    },
    { 
      title: "Register (Ad) Place",
      description: "Get AI-driven recommendations to enhance your ad performance."
    },
    { 
      title: "Generate Content",
      description: "Instantly create high-quality ad content with AI-powered tools."
    }
  ];

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col items-center relative overflow-hidden font-poppins">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-md py-3 px-6 flex justify-between items-center z-50 h-16">
        <h3 className="text-lg font-bold text-gray-900">AdGenius</h3>
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
          <a onClick={() => setSelectedCard("Pricing")} className="text-gray-700 hover:text-blue-600 cursor-pointer">
            Pricing
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Support</a>
        </div>
        <button onClick={() => setPopupOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-md hidden md:block">
          Sign In
        </button>
        <button className="md:hidden bg-black" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-lg shadow-md flex flex-col items-center py-4 z-40 md:hidden gap-y-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
            <a onClick={() => setSelectedCard("Pricing")} className="text-gray-700 hover:text-blue-600 cursor-pointer">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Support</a>
            <button onClick={() => setPopupOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md">
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {selectedCard ? (
        <div className="items-center justify-center text-center px-6 flex-grow">
          {renderCard()}
        </div>
      ) : (
        <motion.div 
          className="text-center mt-24 px-6 flex-grow"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900">Create Stunning Ads with Ease</h2>
          <p className="text-gray-600 mt-3 max-w-lg mx-auto text-lg">Transform your advertising strategy with AI-powered tools that generate stunning videos and banners in minutes</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-20 w-full max-w-6xl pb-[10%]">
            {cardData.map((card, index) => (
              <motion.div 
                key={index} 
                className="bg-white/90 rounded-2xl shadow-xl p-6 w-full cursor-pointer border hover:border-blue-400"
                layout
                whileHover={{ scale: 1.05 }} 
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedCard(card.title)}
              >
                <h3 className="text-xl font-semibold text-blue-700">{card.title}</h3>
                <p className="text-gray-600 mt-2 text-md">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Professional Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">AdGenius</h3>
              <p className="text-gray-600 text-sm">AI-powered advertising solutions for modern marketers.</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">API</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Blog</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AdGenius. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign-In/Sign-Up Popup Modal Animation */}
      <AnimatePresence>
        {popupOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="bg-white/90 text-black backdrop-blur-lg rounded-2xl shadow-xl p-6 w-80 md:w-96 relative"
              variants={popUpAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="absolute top-4 right-4" onClick={() => setPopupOpen(false)}>
                <X size={24} />
              </button>
              <div className="text-center">
                <h2 className="text-gray-900 text-3xl font-bold">{isSignUp ? "Sign Up" : "Sign In"}</h2>
                <p className="text-gray-900 mt-1">{isSignUp ? "Create a new account" : "Access your account"}</p>
                
                {isSignUp && (
                  <input type="text" placeholder="Username" className="text-gray-900 mt-4 w-full px-4 py-2 border rounded-lg" />
                )}
                <input type="email" placeholder="Email" className="text-gray-900 mt-3 w-full px-4 py-2 border rounded-lg" />
                <input type="password" placeholder="Password" className="text-gray-900 mt-3 w-full px-4 py-2 border rounded-lg" />
                
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold shadow-md">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
                
                <p className="text-sm text-gray-600 mt-3">
                  {isSignUp ? "Already a user?" : "Not a user?"}{" "}
                  <span className="text-blue-600 cursor-pointer" onClick={() => setIsSignUp((prev) => !prev)}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;