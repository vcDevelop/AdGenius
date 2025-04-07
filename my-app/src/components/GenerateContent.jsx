import React, { useState } from "react";

const GenerateContent = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("square_1_1");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [imageUrl, setImageUrl] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [error, setError] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);
  const [realism, setRealism] = useState(true);
  const [model, setModel] = useState("default");
  const [style, setStyle] = useState("photo");

  const API_URL = "http://localhost:5000";

  const styleOptions = [
    "photo", "digital-art", "3d", "painting", "low-poly", 
    "pixel-art", "anime", "cyberpunk", "comic", "vintage", 
    "cartoon", "vector", "studio-shot", "dark", "sketch", 
    "mockup", "2000s-phone", "70s-vibe", "watercolor", 
    "art-nouveau", "origami", "surreal", "fantasy", "traditional-japan"
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setImageUrl(null);
    setError(null);

    try {
      const requestBody = {
        prompt, 
        aspect_ratio: aspectRatio,
        model
      };

      // Add style only for classic_fast model
      if (model === "classic_fast") {
        requestBody.styling = {
          style: style // Properly nested style parameter
        };
      } else {
        requestBody.realism = realism;
      }

      const response = await fetch(`${API_URL}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (model === "classic_fast" && data?.data?.generated?.[0]) {
        setImageUrl(data.data.generated[0]);
        setLoading(false);
        setProgress(100);
      } else if (data?.data?.task_id) {
        setTaskId(data.data.task_id);
        checkStatus(data.data.task_id);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const checkStatus = async (taskId) => {
    const statusUrl = `${API_URL}/check-status/${taskId}?model=${model}`;
    let currentProgress = 10;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(statusUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const status = data?.data?.status;

        if (status === "COMPLETED") {
          clearInterval(interval);
          setImageUrl(data?.data?.generated?.[0] || "");
          setLoading(false);
          setProgress(100);
        } else if (status === "FAILED") {
          clearInterval(interval);
          setError("Image generation failed. Please try again.");
          setLoading(false);
        } else {
          currentProgress = Math.min(currentProgress + 15, 95);
          setProgress(currentProgress);
        }
      } catch (err) {
        clearInterval(interval);
        setError(err.message);
        setLoading(false);
      }
    }, 5000);
  };

  const handleBackToHome = () => {
    setCurrentForm(null);
    setPrompt("");
    setAspectRatio("square_1_1");
    setError(null);
    setImageUrl(null);
    setTaskId(null);
    setProgress(10);
    setModel("default");
    setStyle("photo");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Content Generation Platform
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Create stunning visuals and compelling ads
          </p>
        </div>

        {/* Main Content - Made scrollable when image is generated */}
        <div className={`p-4 md:p-6 lg:p-8 ${imageUrl ? "max-h-[70vh] overflow-y-auto" : ""}`}>
          {currentForm === null ? (
            <div className="text-center">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                What would you like to generate?
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setCurrentForm("image")}
                  className="flex flex-col items-center justify-center p-4 md:p-6 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-sky-600 transition-all bg-sky-500 text-white hover:text-white"
                >
                  <div className="bg-gray-200 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm md:text-base font-medium text-white">
                    AI Image Generation
                  </h3>
                  <p className="text-xs md:text-sm text-white mt-1">
                    Create custom images from text prompts
                  </p>
                </button>
                <button
                  onClick={() => setCurrentForm("text")}
                  className="flex flex-col items-center justify-center p-4 md:p-6 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-sky-600 transition-all bg-sky-500 text-white hover:text-white"
                >
                  <div className="bg-gray-200 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm md:text-base font-medium text-white">
                    Text Ad Generation
                  </h3>
                  <p className="text-xs md:text-sm text-white mt-1">
                    Generate compelling ad copy
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center text-sm md:text-base text-gray-900 hover:text-gray-600 border border-gray-300 bg-transparent px-3 py-1 md:px-4 md:py-2 rounded-lg"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {currentForm === "image"
                    ? "AI Image Generation"
                    : "Text Ad Generation"}
                </h2>
                <div className="w-4 md:w-5"></div>
              </div>

              {currentForm === "image" && (
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-900 mb-1">Prompt</label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to generate..."
                        rows={4}
                        className="text-gray-900 w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                        <select
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value)}
                          className="text-gray-900 w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                          <option value="square_1_1">Square (1:1)</option>
                          <option value="classic_4_3">Classic (4:3)</option>
                          <option value="traditional_3_4">Traditional (3:4)</option>
                          <option value="widescreen_16_9">Widescreen (16:9)</option>
                          <option value="social_story_9_16">Social Story (9:16)</option>
                        </select>
                      </div>

                      {model !== "classic_fast" && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="realism-toggle"
                            checked={realism}
                            onChange={(e) => setRealism(e.target.checked)}
                            className="h-4 w-4 text-gray-100 focus:ring-gray-500 border-gray-300 rounded unchecked"
                          />
                          <label htmlFor="realism-toggle" className="ml-2 block text-xs md:text-sm text-gray-700">
                            Enable Realism Mode
                          </label>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Model</label>
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="text-gray-900 w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                          <option value="default">Default Model (Mystic)</option>
                          <option value="classic_fast">Classic Fast Model</option>
                        </select>
                      </div>

                      {model === "classic_fast" && (
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Style</label>
                          <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="text-gray-900 w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          >
                            {styleOptions.map((option) => (
                              <option key={option} value={option}>
                                {option.split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-1 md:pt-2">
                    <button
                      onClick={handleGenerateImage}
                      disabled={loading}
                      className={`w-full py-2 px-3 md:py-3 md:px-4 text-sm md:text-base rounded-lg font-medium border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors ${loading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-black"}`}
                    >
                      {loading ? "Generating..." : "Generate Image"}
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-4">
                  <progress
                    value={progress}
                    max="100"
                    className="w-full h-2 rounded-lg bg-gray-200"
                  ></progress>
                </div>
              )}

              {error && (
                <div className="text-sm md:text-base text-red-600 mt-4">{error}</div>
              )}

              {imageUrl && (
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt="Generated Visual"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateContent;
