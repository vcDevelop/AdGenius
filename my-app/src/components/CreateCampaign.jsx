import { useState } from 'react';

const CreateCampaign = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: '',
    budget: '',
    media: null,
    category: 'Social Media',
    duration: ''
  });
  
  // AI Generation state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Hugging Face API key (in production, store this securely)
  const HF_API_KEY = "Hugging face api key";
  const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3";
  const HF_API_URL = https://api-inference.huggingface.co/models/${MODEL_NAME};

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

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': Bearer ${HF_API_KEY},
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: Generate a detailed ad description about: ${prompt}. The first line should be a catchy title.,
          parameters: {
            max_length: 300,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      const generatedText = result[0].generated_text;
      
      // Split the generated text into lines
      const lines = generatedText.split('\n').filter(line => line.trim());
      
      // First line is the title
      const title = lines[1].trim();
      
      // The rest is the description
      const description = lines.slice(2).join('\n').trim();

      setFormData(prev => ({
        ...prev,
        title,
        description
      }));

    } catch (err) {
      setError(err.message || 'Error generating ad content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign data:', formData);
    alert('Campaign created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4 max-w-md md:max-w-xl lg:max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Campaign</h2>
        
        {/* AI Generation Section */}
        <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
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
              disabled={isGenerating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                        disabled:bg-blue-400 transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="text-sm text-gray-900">Let AI help create your title and description</p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 mt-6"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
