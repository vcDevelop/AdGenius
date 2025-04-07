import Papa from "papaparse";
import React, { useEffect, useState } from "react";

const Pricing = () => {
  const [adType, setAdType] = useState("");
  const [adTypes, setAdTypes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const USD_TO_INR = 83; // Fixed conversion rate, can be replaced with an API call

  // Load ad types dynamically from CSV
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
    
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

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
      setShowTable(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container">
        <h1 className="title text-black">Ad Price Comparison</h1>
        <select
          value={adType}
          onChange={(e) => setAdType(e.target.value)}
          className="dropdown text-black"
        >
          <option value="">Select Ad Type</option>
          {adTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={fetchPrices}
          className="compare-button text-black"
          disabled={loading}
        >
          {loading ? <div className="spinner text-black"></div> : "Compare Prices"}
        </button>

        {showTable && prices.length > 0 ? (
          <table className="price-table text-black">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Price (USD)</th>
                <th>Price (INR)</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <tr key={index}>
                  <td>{item.Platform}</td>
                  <td>${item["Price (USD)"]}</td>
                  <td>₹{item.inrPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : showTable ? (
          <p className="no-data">No data available</p>
        ) : null}
      </div>
    </>
  );
};

export default Pricing;
