import { useState } from 'react';

const CreateCampaign = ({ user }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: '',
    budget: '',
    media: null,
    category: 'Social Media',
    duration: '',
    status: 'draft'
  });
  
  // AI Generation state
  const [prompt, setPrompt] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(10);
  const [aspectRatio, setAspectRatio] = useState("square_1_1");
  const [realism, setRealism] = useState(true);
  const [model, setModel] = useState("default");
  const [style, setStyle] = useState("photo");
  const [activePreview, setActivePreview] = useState('banner');

  const styleOptions = [
    "photo", "digital-art", "3d", "painting", "low-poly", 
    "pixel-art", "anime", "cyberpunk", "comic", "vintage", 
    "cartoon", "vector", "studio-shot", "dark", "sketch", 
    "mockup", "2000s-phone", "70s-vibe", "watercolor", 
    "art-nouveau", "origami", "surreal", "fantasy", "traditional-japan"
  ];

  const adFormatPreviews = {
    banner: { name: 'Banner', dimensions: '728x90', className: 'w-full h-24 bg-white border border-gray-300 rounded' },
    sidebar: { name: 'Sidebar', dimensions: '300x250', className: 'w-48 h-64 bg-white border border-gray-300 rounded' },
    header: { name: 'Header', dimensions: '970x90', className: 'w-full h-20 bg-white border border-gray-300 rounded' },
    footer: { name: 'Footer', dimensions: '728x90', className: 'w-full h-24 bg-white border border-gray-300 rounded' },
    inContent: { name: 'In-Content', dimensions: '300x250', className: 'w-48 h-64 bg-white border border-gray-300 rounded' },
    popup: { name: 'Popup', dimensions: '400x400', className: 'w-64 h-64 bg-white border border-gray-300 rounded' },
    interstitial: { name: 'Interstitial', dimensions: 'Full Screen', className: 'w-full h-96 bg-white border border-gray-300 rounded' }
  };

  const API_URL = "http://localhost:5000";
  const HF_API_KEY = "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";
  const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3";
  const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      
      [name]: files ? files[0] : value
    }));
  };

  const generateAdContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGeneratingText(true);
    setError(null);

    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Generate a detailed ad description about: ${prompt}. The first line should be a short catchy title.`,
          parameters: {
            max_length: 20,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate content');
      const result = await response.json();
      const generatedText = result[0].generated_text;
      const lines = generatedText.split('\n').filter(line => line.trim());
      const title = lines[1].trim();
      const description = lines.slice(2).join('\n').trim();

      setFormData(prev => ({
        ...prev,
        title,
        description
      }));

    } catch (err) {
      setError(err.message || 'Error generating ad content');
    } finally {
      setIsGeneratingText(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a valid prompt.");
      return;
    }

    setIsGeneratingImage(true);
    setProgress(10);
    setImageUrl(null);
    setError(null);

    try {
      const requestBody = {
        prompt, 
        aspect_ratio: aspectRatio,
        model
      };

      if (model === "classic_fast") {
        requestBody.styling = { style: style };
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
        setIsGeneratingImage(false);
        setProgress(100);
      } else if (data?.data?.task_id) {
        checkStatus(data.data.task_id);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      setError(err.message);
      setIsGeneratingImage(false);
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
          setIsGeneratingImage(false);
          setProgress(100);
        } else if (status === "FAILED") {
          clearInterval(interval);
          setError("Image generation failed. Please try again.");
          setIsGeneratingImage(false);
        } else {
          currentProgress = Math.min(currentProgress + 15, 95);
          setProgress(currentProgress);
        }
      } catch (err) {
        clearInterval(interval);
        setError(err.message);
        setIsGeneratingImage(false);
      }
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
  
      const campaignData = {
        title: formData.title,
        description: formData.description,
        audience: formData.audience,
        budget: parseFloat(formData.budget),
        category: formData.category,
        duration: parseInt(formData.duration),
        status: formData.status,
        generatedImage: imageUrl || null
      };
  
      const response = await fetch(`${API_URL}/api/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create campaign");
      }
  
      const data = await response.json();
      setSuccess("Campaign created successfully!");
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        audience: '',
        budget: '',
        media: null,
        category: 'Social Media',
        duration: '',
        status: 'draft'
      });
      setImageUrl(null);
      setPrompt('');
    } catch (err) {
      setError(err.message || "An unknown error occurred");
      console.error("Campaign creation error:", err);
    }
  };
  const renderAdPreview = () => {
    const format = adFormatPreviews[activePreview];
    
    return (
      <div className={`${format.className} relative overflow-hidden`}>
        {imageUrl ? (
          <div className="relative h-full w-full">
            <img 
              src={imageUrl} 
              alt="Ad content" 
              className={`object-cover ${activePreview === 'interstitial' ? 'h-full w-full' : 'h-full w-full'}`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              <h3 className="font-bold text-sm truncate">{formData.title || "Ad Title"}</h3>
              <p className="text-xs truncate">{formData.description || "Ad description text would appear here"}</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500 text-center p-4">
              {formData.title || "Preview will appear here"}<br />
              {formData.description && (
                <span className="text-xs">{formData.description}</span>
              )}
            </p>
          </div>
        )}
        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
          {format.dimensions}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Campaign</h2>
        
        {/* AI Generation Section */}
               {/* AI Generation Section */}
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <label className="block text-gray-900 font-medium">Generate with AI</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Organic pet food'"
              className="text-black flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateAdContent}
              disabled={isGeneratingText}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                        disabled:bg-blue-400 transition-colors"
            >
              {isGeneratingText ? 'Generating...' : 'Generate Text'}
            </button>
            <button
              onClick={generateImage}
              disabled={isGeneratingImage}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
                        disabled:bg-purple-400 transition-colors"
            >
              {isGeneratingImage ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
          <p className="text-sm text-gray-900">Let AI help create your campaign content</p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          
          {/* Image Generation Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="text-gray-900 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="square_1_1">Square (1:1)</option>
                <option value="classic_4_3">Classic (4:3)</option>
                <option value="traditional_3_4">Traditional (3:4)</option>
                <option value="widescreen_16_9">Widescreen (16:9)</option>
                <option value="social_story_9_16">Social Story (9:16)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-gray-900 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default Model (Mystic)</option>
                <option value="classic_fast">Classic Fast Model</option>
              </select>
            </div>
            
            {model !== "classic_fast" && (
              <div className="flex items-center justify-center">
                <div className="mt-5">
                  <input
                    type="checkbox"
                    id="realism-toggle"
                    checked={realism}
                    onChange={(e) => setRealism(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="realism-toggle" className="ml-2 block text-xs md:text-sm text-gray-700">
                    Enable Realism Mode
                  </label>
                </div>
              </div>
            )}

            {model === "classic_fast" && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="text-gray-900 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          {isGeneratingImage && (
            <div className="mt-2">
              <progress
                value={progress}
                max="100"
                className="w-full h-2 rounded-lg bg-gray-200"
              ></progress>
              <p className="text-xs text-gray-500 mt-1">Generating image... {progress}%</p>
            </div>
          )}
        </div>

        {/* Ad Format Previews */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ad Format Previews</h3>
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(adFormatPreviews).map(format => (
              <button
                key={format}
                onClick={() => setActivePreview(format)}
                className={`px-3 py-1 text-sm rounded-md ${
                  activePreview === format 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {adFormatPreviews[format].name}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center">
            {renderAdPreview()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Ad Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 text-gray-900 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full text-gray-900 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Target Audience</label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  placeholder="e.g., 'Pet owners aged 25-45'"
                  className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Second Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget"
                  className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Upload Media</label>
                <input
                  type="file"
                  name="media"
                  onChange={handleChange}
                  className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Generated image preview:</p>
                    <img
                      src={imageUrl}
                      alt="Generated Visual Preview"
                      className="w-32 h-32 object-cover rounded mt-1 border border-gray-300"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Social Media</option>
                  <option>Search Ads</option>
                  <option>Display Ads</option>
                  <option>Video Ads</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-900 font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 mt-6">
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;