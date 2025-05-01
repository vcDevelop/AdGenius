import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "react-modal";
import axios from "axios";

const AdDistribution = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "google", label: "Google Ads" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" }
  ];

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("http://localhost:5000/api/campaigns", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAds(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching ads:", err);
      }
    };

    fetchUserAds();
  }, []);

  const handleDistribute = (ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handlePlatformChange = (selectedOptions) => {
    setSelectedPlatforms(selectedOptions);
  };

  const confirmDistribution = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/distribute",
        {
          adId: selectedAd._id,
          platforms: selectedPlatforms.map(p => p.value)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsModalOpen(false);
      alert("Ad distributed successfully!");
    } catch (err) {
      console.error("Distribution error:", err);
      alert("Failed to distribute ad");
    }
  };

  if (loading) return <div className="p-8 text-black">Loading ads...</div>;
  if (error) return <div className="p-8 text-black">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full bg-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Your Advertising Campaigns</h1>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 text-left text-black font-semibold">Preview</th>
              <th className="py-4 px-6 text-left text-black font-semibold">Title</th>
              <th className="py-4 px-6 text-left text-black font-semibold">Description</th>
              <th className="py-4 px-6 text-left text-black font-semibold">Created</th>
              <th className="py-4 px-6 text-left text-black font-semibold">Status</th>
              <th className="py-4 px-6 text-left text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6">
                  {ad.generatedImage && (
                    <img 
                      src={ad.generatedImage} 
                      alt={ad.title}
                      className="w-24 h-16 object-contain"
                    />
                  )}
                </td>
                <td className="py-4 px-6 text-black">{ad.title}</td>
                <td className="py-4 px-6 text-black max-w-xs truncate">{ad.description}</td>
                <td className="py-4 px-6 text-black">
                  {new Date(ad.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-black capitalize">{ad.status}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDistribute(ad)}
                    className="text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
                  >
                    Distribute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '90%',
            padding: '2rem',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
        }}
        contentLabel="Distribution Modal"
      >
        <h2 className="text-2xl font-bold mb-4 text-black">
          Distribute: {selectedAd?.title}
        </h2>
        <div className="mb-6">
          <label className="block text-black mb-2">Select Platforms</label>
          <Select
            isMulti
            options={platformOptions}
            onChange={handlePlatformChange}
            value={selectedPlatforms}
            className="text-black"
            classNamePrefix="select"
            placeholder="Choose platforms..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDistribution}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
            disabled={!selectedPlatforms.length}
          >
            Confirm Distribution
          </button>
        </div>
      </Modal>
    </div>
  );
};

Modal.setAppElement('#root');

export default AdDistribution;