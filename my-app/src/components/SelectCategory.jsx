import { useState } from 'react';
import { useForm } from 'react-hook-form';

const AdPlacementRegistration = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [placementType, setPlacementType] = useState('banner');

  const onSubmit = (data) => {
    console.log('Ad placement registered:', data);
    setSubmitted(true);
    // Here you would typically send the data to your backend API
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        {submitted ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-black">Registration Successful!</h2>
            <p className="mt-2 text-black">Your ad placement has been registered and is pending approval.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register Another Placement
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-black mb-2">Register Your Ad Placement</h1>
            <p className="text-black mb-8">Fill out the form to register ad spaces on your website</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Website Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-4">Website Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Website Name*</label>
                    <input
                      {...register("websiteName", { required: "Website name is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                    {errors.websiteName && <p className="mt-1 text-sm text-red-600">{errors.websiteName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Website URL*</label>
                    <input
                      {...register("websiteUrl", { 
                        required: "Website URL is required",
                        pattern: {
                          value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                          message: "Enter a valid URL"
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="https://example.com"
                    />
                    {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Category*</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Category</option>
                      <option value="news">News & Media</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="technology">Technology</option>
                      <option value="education">Education</option>
                      <option value="health">Health & Wellness</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Monthly Traffic*</label>
                    <select
                      {...register("monthlyTraffic", { required: "Monthly traffic estimate is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Range</option>
                      <option value="1k-10k">1,000 - 10,000 visitors</option>
                      <option value="10k-50k">10,000 - 50,000 visitors</option>
                      <option value="50k-100k">50,000 - 100,000 visitors</option>
                      <option value="100k-500k">100,000 - 500,000 visitors</option>
                      <option value="500k-1m">500,000 - 1M visitors</option>
                      <option value="1m+">1M+ visitors</option>
                    </select>
                    {errors.monthlyTraffic && <p className="mt-1 text-sm text-red-600">{errors.monthlyTraffic.message}</p>}
                  </div>
                </div>
              </div>

              {/* Ad Placement Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-4">Ad Placement Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Placement Type*</label>
                    <select
                      {...register("placementType", { required: "Placement type is required" })}
                      onChange={(e) => setPlacementType(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="banner">Banner</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="header">Header</option>
                      <option value="footer">Footer</option>
                      <option value="in-content">In-Content</option>
                      <option value="popup">Popup</option>
                      <option value="interstitial">Interstitial</option>
                      <option value="video">Video</option>
                    </select>
                    {errors.placementType && <p className="mt-1 text-sm text-red-600">{errors.placementType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Placement Name*</label>
                    <input
                      {...register("placementName", { required: "Placement name is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="e.g. Homepage Top Banner"
                    />
                    {errors.placementName && <p className="mt-1 text-sm text-red-600">{errors.placementName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Dimensions (Width × Height)*</label>
                    <div className="flex space-x-2">
                      <input
                        {...register("width", { 
                          required: "Width is required",
                          min: { value: 1, message: "Minimum width is 1px" }
                        })}
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Width (px)"
                      />
                      <span className="flex items-center">×</span>
                      <input
                        {...register("height", { 
                          required: "Height is required",
                          min: { value: 1, message: "Minimum height is 1px" }
                        })}
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Height (px)"
                      />
                    </div>
                    {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width.message}</p>}
                    {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Max Ads Per Page*</label>
                    <input
                      {...register("maxAds", { 
                        required: "Max ads is required",
                        min: { value: 1, message: "Minimum is 1" }
                      })}
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                    {errors.maxAds && <p className="mt-1 text-sm text-red-600">{errors.maxAds.message}</p>}
                  </div>
                </div>

                {/* Dynamic fields based on placement type */}
                {placementType === 'video' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Video Duration (seconds)</label>
                      <input
                        {...register("videoDuration")}
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Skip Option Available</label>
                      <select
                        {...register("skipAvailable")}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Allowed Ad Formats*</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          {...register("formats.image")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Image</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("formats.html")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">HTML</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("formats.video")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Video</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("formats.richMedia")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Rich Media</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Targeting Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          {...register("targeting.geo")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Geographic</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("targeting.device")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Device Type</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("targeting.interest")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Interest-based</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("targeting.contextual")}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-black">Contextual</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Availability */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-4">Pricing & Availability</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Pricing Model*</label>
                    <select
                      {...register("pricingModel", { required: "Pricing model is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Model</option>
                      <option value="cpm">CPM (Cost per 1000 impressions)</option>
                      <option value="cpc">CPC (Cost per click)</option>
                      <option value="cpa">CPA (Cost per action)</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                    {errors.pricingModel && <p className="mt-1 text-sm text-red-600">{errors.pricingModel.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Price*</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-black sm:text-sm">$</span>
                      </div>
                      <input
                        {...register("price", { 
                          required: "Price is required",
                          min: { value: 0.01, message: "Minimum price is $0.01" }
                        })}
                        type="number"
                        step="0.01"
                        className="w-full pl-7 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Availability*</label>
                    <select
                      {...register("availability", { required: "Availability is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Availability</option>
                      <option value="always">Always Available</option>
                      <option value="business">Business Hours Only</option>
                      <option value="specific">Specific Times</option>
                    </select>
                    {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>}
                  </div>

                  {watch("availability") === 'specific' && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Specific Times</label>
                      <input
                        {...register("specificTimes")}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="e.g. Mon-Fri 9am-5pm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-4">Additional Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Screenshot of Placement</label>
                  <input
                    {...register("screenshot")}
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border rounded-lg text-black"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-1">Special Requirements</label>
                  <textarea
                    {...register("requirements")}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Any special requirements for advertisers"
                  />
                </div>

                <div className="mt-4 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register("termsAccepted", { required: "You must accept the terms" })}
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-black">
                      I agree to the Ad Placement Terms and Conditions*
                    </label>
                    <p className="text-black">By registering, you agree to our platform terms and privacy policy.</p>
                  </div>
                </div>
                {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Register Ad Placement
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdPlacementRegistration;