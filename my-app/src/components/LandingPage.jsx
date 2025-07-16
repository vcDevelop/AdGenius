import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdCreation from "./AdCreation";
import GenerateContent from "./GenerateContent";
import CreateCampaign from "./CreateCampaign";
import SelectCategory from "./SelectCategory";
import Pricing from "./Pricing";
import Footer from "./Footer";
import Navbar from "./NavBar";

const LandingPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  // Check for logged-in user on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const renderCard = () => {
    switch (selectedCard) {
      case "Distribution":
        return <AdCreation user={user} />;
      case "Generate Content":
        return <GenerateContent user={user} />;
      case "Create Campaign":
        return <CreateCampaign user={user} />;
      case "Register (Ad) Place":
        return <SelectCategory user={user} />;
      case "Pricing":
        return <Pricing user={user} />;
      default:
        return null;
    }
  };

  const cardData = [
    {
      title: "Distribution",
      description: "Optimize and automate ad distribution across multiple platforms.",
    },
    {
      title: "Create Campaign",
      description: "Effortlessly set up, manage, and track ad campaigns in one place.",
    },
    {
      title: "Register (Ad) Place",
      description: "Get AI-driven recommendations to enhance your ad performance.",
    },
    {
      title: "Generate Content",
      description: "Instantly create high-quality ad content with AI-powered tools.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar 
        setCurrentPage={setCurrentPage} 
        user={user} 
        setUser={setUser}
        isPopupOpen={isPopupOpen}
        setPopupOpen={setIsPopupOpen}
      />
      {currentPage === 'pricing' && <Pricing user={user} />}
      <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col items-center relative overflow-hidden font-poppins">
        {/* Main Content */}
        {selectedCard ? (
          <div className="items-center justify-center text-center px-6 flex-grow mt-16">
            {renderCard()}
          </div>
        ) : (
          <motion.div
            className="text-center mt-24 px-6 flex-grow"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
              Create Stunning Ads with Ease
            </h2>
            <p className="text-gray-600 mt-3 max-w-lg mx-auto text-lg">
              Transform your advertising strategy with AI-powered tools that
              generate stunning videos and banners in minutes
            </p>
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
                  onClick={() => {
                    if (user || card.title === "Register (Ad) Place") {
                      setSelectedCard(card.title);
                    } else {
                      setIsPopupOpen(true);
                    }
                  }}
                >
                  <h3 className="text-xl font-semibold text-blue-700">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-md">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;