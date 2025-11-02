import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, MapPin, Tag, Upload } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';

export function ReportForm({ onBack }: { onBack?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, address: "" });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const createReport = useMutation(api.reports.createReport);
  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);

  const categories = [
    "Infrastructure",
    "Safety", 
    "Environment",
    "Transportation",
    "Public Services",
    "Utilities",
    "Parks & Recreation"
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          });
          toast.success("Location captured successfully!");
        },
        (error) => {
          toast.error("Failed to get location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  function LocationPicker({} : { }) {
    useMapEvents({
      click(e) {
        setLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          address: `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`,
        });
        toast.success('Location selected on map');
      }
    });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageId = undefined;

      // Upload image if selected
      if (selectedImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        
        const { storageId } = await result.json();
        imageId = storageId;
      }

      // Create the report
      await createReport({
        title: title.trim(),
        description: description.trim(),
        category,
        location,
        imageId,
        tags,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Infrastructure");
      setLocation({ lat: 40.7128, lng: -74.0060, address: "" });
      setTags([]);
      setSelectedImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      toast.success("Report submitted successfully! AI analysis will be performed if an image was uploaded.");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 relative z-10"
        >
          {/* Mobile back button inside the report form for easy navigation */}
          {onBack && (
            // Use fixed positioning so the back button isn't clipped by the card's rounded/overflow
            // and stays visible above the form on small screens.
            <div className="md:hidden fixed left-4 top-4 z-50">
              <button
                onClick={onBack}
                className="px-3 py-1 bg-black/80 text-white rounded-md shadow-sm backdrop-blur-sm"
                aria-label="Back to dashboard"
              >
                ← Back
              </button>
            </div>
          )}
          <h2 className="text-3xl font-bold text-white mb-2">Report an Issue</h2>
          <p className="text-white/70">Help improve your community by reporting civic issues</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Title */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-white font-medium mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-white font-medium mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              required
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-white font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-white font-medium mb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Street address or landmark"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <motion.button
                type="button"
                onClick={handleGetLocation}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Get Location</span>
              </motion.button>
            </div>
            <p className="text-white/50 text-sm mt-1">
              Current coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>

            {/* Map selector - click to choose a location */}
            <div className="mt-4 rounded-lg overflow-hidden border-2 border-white/10">
              <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: 260, width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker center={[location.lat, location.lng]} radius={8} pathOptions={{ color: '#e11d24', fillColor: '#e11d24' }} />
                <LocationPicker />
              </MapContainer>
              <p className="text-white/60 text-sm p-2">Click on the map to set the report location manually.</p>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-white font-medium mb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <motion.button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-white font-medium mb-2 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Photo Evidence</span>
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {selectedImage ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="space-y-2"
                >
                  <div className="text-green-400 flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Image selected: {selectedImage.name}</span>
                  </div>
                  <p className="text-white/60 text-sm">AI will analyze this image for automatic categorization</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-12 h-12 text-white/40 mx-auto" />
                  <div className="text-white/70">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      Click to upload
                    </button>{" "}
                    or drag and drop
                  </div>
                  <div className="text-white/50 text-sm">PNG, JPG up to 10MB • AI analysis included</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-blue-900 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Report"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
