import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Auth({ isPopupOpen, isSignUp, error, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [localError, setLocalError] = useState(error || "");
  const [localSignUp, setLocalSignUp] = useState(isSignUp);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const popUpAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    const endpoint = localSignUp ? "/api/register" : "/api/login";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          localSignUp ? formData : {
            email: formData.email,
            password: formData.password
          }
        )
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      if (!localSignUp) {
        localStorage.setItem("token", data.token);
        window.location.reload(); // Or use a prop like setUser(data.user) if available
      } else {
        setLocalSignUp(false);
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
      }

      onClose(); // ✅ Close the popup
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isPopupOpen && (
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
            <button className="absolute top-4 right-4" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="text-center">
              <h2 className="text-gray-900 text-3xl font-bold">
                {localSignUp ? "Sign Up" : "Sign In"}
              </h2>
              <p className="text-gray-900 mt-1">
                {localSignUp ? "Create a new account" : "Access your account"}
              </p>

              {localError && <div className="mt-2 text-red-500 text-sm">{localError}</div>}

              <form onSubmit={handleSubmit}>
                {localSignUp && (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="text-gray-900 mt-4 w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="text-gray-900 mt-3 w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </>
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-gray-900 mt-3 w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-gray-900 mt-3 w-full px-4 py-2 border rounded-lg"
                  required
                  minLength="6"
                />

                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : localSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-3">
                {localSignUp ? "Already a user?" : "Not a user?"}{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setLocalSignUp(prev => !prev);
                    setLocalError("");
                  }}
                >
                  {localSignUp ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
