import React, { useState } from "react";
import Select from "react-select";

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

const AdDistribution = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [targetAudience, setTargetAudience] = useState([]);
  const [budget, setBudget] = useState();
  const [duration, setDuration] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ad Submitted:", {
      selectedPlatform,
      targetAudience,
      budget,
      duration,
    });
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
    </div>
  );
};

export default AdDistribution;
