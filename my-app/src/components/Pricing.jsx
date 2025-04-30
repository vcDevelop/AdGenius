import Papa from "papaparse";
import React, { useEffect, useState } from "react";

const Pricing = () => {
  const [adType, setAdType] = useState("");
  const [adTypes, setAdTypes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const USD_TO_INR = 83;

  useEffect(() => {
    const fetchAdTypes = async () => {
      try {
        const response = await fetch("../public/ad_prices.csv");
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;
        
        const uniqueAdTypes = [...new Set(parsedData.map((item) => item["Ad Type"]))];
        setAdTypes(uniqueAdTypes);
      } catch (error) {
        console.error("Error loading CSV data", error);
      }
    };

    fetchAdTypes();
  }, []);

  const fetchPrices = async () => {
    if (!adType) return;
    setLoading(true);
    setShowTable(false);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch("../public/ad_prices.csv");
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: true }).data;

      const filteredPrices = parsedData
        .filter((item) => item["Ad Type"].toLowerCase() === adType.toLowerCase())
        .map((item) => ({
          ...item,
          inrPrice: (parseFloat(item["Price (USD)"]) * USD_TO_INR).toFixed(2),
        }));

      setPrices(filteredPrices);
      setShowTable(true);
    } catch (error) {
      console.error("Error loading CSV data", error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8"> {/* Increased top padding */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Advertising Platform Pricing</h1>
          <p className="text-gray-600">Compare costs across different advertising platforms</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="ad-type" className="block text-sm font-medium text-gray-700 mb-1">
                Advertisement Type
              </label>
              <select
                id="ad-type"
                value={adType}
                onChange={(e) => setAdType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
                disabled={loading}
              >
                <option value="">Select an ad type...</option>
                {adTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={fetchPrices}
                disabled={!adType || loading}
                className={`w-full px-4 py-2.5 rounded-md font-medium text-white transition-colors ${
                  !adType || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Compare Prices"
                )}
              </button>
            </div>
          </div>
        </div>

        {showTable && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (USD)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (INR)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prices.length > 0 ? (
                    prices.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.Platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${parseFloat(item["Price (USD)"]).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ₹{item.inrPrice}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pricing data available for this ad type
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showTable && prices.length > 0 && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Exchange rate: 1 USD = {USD_TO_INR} INR (approximate market rate)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;