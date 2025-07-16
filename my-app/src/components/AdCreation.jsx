import React, { useState, useEffect } from "react";
import axios from "axios";

const AdDistribution = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("https://adgenius-backend-6euo.onrender.com/api/campaigns", {
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

  const handleDistribute = async (ad) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://adgenius-backend-6euo.onrender.com/api/distribute",
        { adId: ad._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Ad distributed successfully to matching websites!");
    } catch (err) {
      console.error("Distribution error:", err);
      alert("Failed to distribute ad.");
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
    </div>
  );
};

export default AdDistribution;
