import axios from "axios";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";

const GenerateContent = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const videoRef = useRef(null);
  const API_KEY = "bcb5cd955481420f8f6ebcd71c0f2613";
  const PRODUCTION_API_URL = "https://prod-api.tavus.io/proxy/rqh/v2/videos";

  // Load video with HLS
  useEffect(() => {
    if (videoUrl && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      return () => hls.destroy(); // Clean up on unmount
    }
  }, [videoUrl]);

  // Generate video from prompt
  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError("Please enter a script to generate the video.");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setProcessingMessage("Requesting video generation...");

    const requestData = {
      script: prompt,

      replica_id: "r0e341823b41", // Change if needed
      video_name: "Generated Video",
      fast: false,
      transparent_background: false,
    };

    try {
      const response = await axios.post(PRODUCTION_API_URL, requestData, {
        headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      });

      if (response.data?.video_id) {
        setVideoId(response.data.video_id);
        fetchMuxUrl(response.data.video_id); // Begin polling for URL
      } else {
        throw new Error("No video ID returned.");
      }
    } catch (err) {
      console.error(err);
      setError("Error generating video. Please try again.");
      setLoading(false);
    }
  };

  // Polling MUX stream URL
  const fetchMuxUrl = async (id, retries = 0) => {
    try {
      setIsRefreshing(true);
      const response = await axios.get(`${PRODUCTION_API_URL}/${id}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (response.data.status === "ready" && response.data.stream_url) {
        setVideoUrl(response.data.stream_url);
        setProcessingMessage("");
        setLoading(false);
        setIsRefreshing(false);
      } else if (retries < 10) {
        setProcessingMessage(`Processing video... (${retries + 1}/10)`);
        setTimeout(() => fetchMuxUrl(id, retries + 1), Math.pow(2, retries) * 1000);
      } else {
        throw new Error("Video took too long to process.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch video. Please try again.");
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 pt-8 md:pt-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Content Generation Platform</h1>
          <p className="text-base text-gray-500 mt-1">Create stunning visuals and compelling ads</p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Text to Video Generator</h2>

          <textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm md:text-base mb-4"
            style={{ color: "black" }}
          />

          <button
            onClick={generateVideo}
            className={`w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Video"}
          </button>

          {processingMessage && <p className="text-sm text-gray-600 mt-2">{processingMessage}</p>}

          {videoId && (
            <button
              onClick={() => fetchMuxUrl(videoId)}
              className={`mt-2 bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Video"}
            </button>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {videoUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Generated Video:</h3>
              <video ref={videoRef} controls className="w-full rounded-lg shadow">
                <source src={videoUrl} type="application/x-mpegURL" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateContent;
