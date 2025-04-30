import React, { useState } from "react";
import Select from "react-select";
import Modal from "react-modal";

// Make sure to bind modal to your appElement (for accessibility reasons)
Modal.setAppElement('#root');

const adPlatforms = [
  { value: "google", label: "Google Ads" },
  { value: "facebook", label: "Facebook Ads" },
  { value: "instagram", label: "Instagram Ads" },
  { value: "linkedin", label: "LinkedIn Ads" },
  { value: "twitter", label: "Twitter Ads" },
];

const audienceOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
  { value: "tech", label: "Tech Enthusiasts" },
  { value: "business", label: "Business Professionals" },
  { value: "gaming", label: "Gamers" },
];

const subscriptionPlans = [
  {
    id: 1,
    name: "Starter",
    price: "$9.99/month",
    features: [
      "5 ads per month",
      "Basic analytics",
      "Email support"
    ],
    recommended: false
  },
  {
    id: 2,
    name: "Professional",
    price: "$29.99/month",
    features: [
      "20 ads per month",
      "Advanced analytics",
      "Priority support",
      "A/B testing"
    ],
    recommended: true
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$99.99/month",
    features: [
      "Unlimited ads",
      "Premium analytics",
      "24/7 support",
      "Dedicated account manager",
      "Custom integrations"
    ],
    recommended: false
  }
];

const AdDistribution = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [targetAudience, setTargetAudience] = useState([]);
  const [budget, setBudget] = useState();
  const [duration, setDuration] = useState();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show subscription modal instead of directly submitting
    setShowSubscriptionModal(true);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePurchase = () => {
    if (!selectedPlan) {
      alert("Please select a subscription plan");
      return;
    }
    
    // Here you would typically integrate with a payment processor
    console.log("Purchased plan:", selectedPlan);
    
    // After successful purchase, submit the ad
    console.log("Ad Submitted:", {
      selectedPlatform,
      targetAudience,
      budget,
      duration,
    });
    
    // Close the modal
    setShowSubscriptionModal(false);
    alert(`Thank you for purchasing ${selectedPlan.name} plan! Your ad has been submitted.`);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg mt-20 mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Distribute Your Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <label className="block text-gray-700 font-semibold">Select Platform</label>
        <Select
          options={adPlatforms}
          onChange={setSelectedPlatform}
          placeholder="Choose platform..."
          className="text-black"
        />

        {/* Target Audience */}
        <label className="block text-gray-700 font-semibold">Target Audience</label>
        <Select
          options={audienceOptions}
          isMulti
          onChange={setTargetAudience}
          placeholder="Select audience..."
          className="text-black"
        />

        {/* Budget Input */}
        <label className="block text-gray-700 font-semibold">Budget ($)</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg text-black"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          min="10"
        />

        {/* Duration Input */}
        <label className="block text-gray-700 font-semibold">Duration (Days)</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg text-black"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700"
        >
          Submit Ad
        </button>
      </form>

      {/* Subscription Modal */}
      <Modal
        isOpen={showSubscriptionModal}
        onRequestClose={() => setShowSubscriptionModal(false)}
        contentLabel="Subscription Required"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Subscription Plan</h2>
          <p className="text-gray-600 mb-6">To distribute your ads, please select a subscription plan:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {subscriptionPlans.map(plan => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'} ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.recommended && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <p className="text-lg font-semibold text-blue-600 my-2">{plan.price}</p>
                <ul className="text-gray-600 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!selectedPlan}
            >
              Purchase & Submit Ad
            </button>
          </div>
        </div>
      </Modal>

      {/* Add these styles to your CSS file or style tag */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          outline: none;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default AdDistribution;