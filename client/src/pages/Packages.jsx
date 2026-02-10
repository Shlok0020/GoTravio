import React, { useEffect, useState } from "react";
import { API } from "../api.js";
import { 
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  Shield,
  ChevronRight,
  Filter,
  Search,
  Heart,
  TrendingUp,
  Sparkles,
  Navigation,
  Hotel,
  Utensils,
  Car,
  Ticket,
  Globe,
  Award,
  CheckCircle,
  MessageCircle,
  Phone,
  Zap,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Pause,
  Play,
  User,
  Mail,
  Send,
  AlertCircle,
  X,
  Package as PackageIcon,
  Tag,
  DollarSign,
  FileText,
  Mountain,
  Waves,
  Sun,
  Snowflake,
  Castle,
  Coffee,
  Palette
} from "lucide-react";

// ================= CIRCULAR CAROUSEL COMPONENT =================

const CircularCarousel = ({ packages }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const totalPackages = packages.length;
  const radius = 180;
  const mobileRadius = 120;
  const angleStep = (2 * Math.PI) / totalPackages;

  useEffect(() => {
    if (totalPackages <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPackages);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [totalPackages, isPaused]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalPackages) % totalPackages);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalPackages);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const getCardPosition = (index, isMobile = false) => {
    const currentRadius = isMobile ? mobileRadius : radius;
    const angle = angleStep * index - Math.PI / 2;
    const x = Math.cos(angle) * currentRadius;
    const y = Math.sin(angle) * currentRadius;
    
    const distance = Math.min(
      Math.abs(index - activeIndex),
      totalPackages - Math.abs(index - activeIndex)
    );
    const scale = 1 - (distance * 0.15);
    const opacity = 1 - (distance * 0.3);
    const zIndex = totalPackages - distance;
    
    return { x, y, scale, opacity, zIndex };
  };

  const activePackage = packages[activeIndex] || packages[0];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      {/* Carousel Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRightIcon size={24} />
        </button>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block relative w-full h-full">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-80 opacity-0 pointer-events-none"></div>
          </div>

          {/* Circular Cards */}
          {packages.map((pkg, index) => {
            const position = getCardPosition(index);
            const isActive = index === activeIndex;
            
            return (
              <button
                key={pkg._id || pkg.id || index}
                onClick={() => handleCardClick(index)}
                className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
                  isActive ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                }`}
                style={{
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                  width: isActive ? '320px' : '200px',
                }}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                  <div className={`rounded-2xl overflow-hidden border-2 ${
                    isActive 
                      ? 'border-orange-500 shadow-2xl scale-110' 
                      : 'border-gray-200 shadow-lg'
                  } transition-all duration-300`}>
                    <div className="relative">
                      <div className="h-32 overflow-hidden">
                        <img
                          src={pkg.imageUrl || pkg.image || pkg.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400"}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                      
                      <div className="p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{pkg.title}</h3>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold">4.5</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                          <MapPin size={10} />
                          <span className="truncate">{pkg.location || pkg.destination}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            <span>{pkg.days || pkg.duration} days</span>
                          </div>
                          <div className="text-sm font-bold text-orange-600">
                            ₹{pkg.priceFrom?.toLocaleString() || pkg.price?.toLocaleString() || "Custom"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden relative w-full h-full">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-64">
            {activePackage && (
              <div className="rounded-2xl overflow-hidden border-2 border-orange-500 shadow-2xl">
                <div className="relative">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={activePackage.imageUrl || activePackage.image || activePackage.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400"}
                      alt={activePackage.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{activePackage.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">4.5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <MapPin size={14} />
                      <span>{activePackage.location || activePackage.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock size={14} />
                        <span>{activePackage.days || activePackage.duration} days</span>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        ₹{activePackage.priceFrom?.toLocaleString() || activePackage.price?.toLocaleString() || "Custom"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Cards for Mobile */}
          {packages.map((pkg, index) => {
            if (index === activeIndex) return null;
            
            const offset = index > activeIndex ? 1 : -1;
            
            return (
              <button
                key={pkg._id || pkg.id || index}
                onClick={() => handleCardClick(index)}
                className="absolute top-1/2 transform -translate-y-1/2 z-20"
                style={{
                  left: `calc(50% + ${offset * 100}px)`,
                  opacity: 0.7,
                  transform: `translateY(-50%) scale(0.8)`,
                }}
              >
                <div className="w-48 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <div className="h-24 overflow-hidden">
                    <img
                      src={pkg.imageUrl || pkg.image || pkg.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400"}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{pkg.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">{pkg.days || pkg.duration}d</div>
                      <div className="text-xs font-bold text-orange-600">
                        ₹{pkg.priceFrom?.toLocaleString() || pkg.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Package Details */}
      {activePackage && (
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {activePackage.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {activePackage.description}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-sm font-medium">{activePackage.location || activePackage.destination}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 rounded-full">
                <Clock size={16} className="text-orange-600" />
                <span className="text-sm font-medium">{activePackage.days || activePackage.duration} days</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
                <Users size={16} className="text-green-600" />
                <span className="text-sm font-medium">{activePackage.tag || "All Groups"}</span>
              </div>
            </div>
            
            <a
              href={`https://wa.me/916371106588?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(activePackage.title)}%20package`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle size={20} />
              Book This Package
              <ChevronRightIcon size={20} />
            </a>
          </div>
        </div>
      )}

      {/* Package Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {packages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'w-6 bg-gradient-to-r from-orange-500 to-pink-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ================= PACKAGE ENQUIRY FORM COMPONENT =================

const PackageEnquiryForm = ({ selectedPackage, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travellers: "1",
    budget: "",
    travelDate: "",
    message: "",
    packageName: selectedPackage?.title || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Validation
      if (!formData.name || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare enquiry data
      const enquiryData = {
        name: formData.name,
        service: `Package: ${formData.packageName}`,
        phone: formData.phone,
        email: formData.email || '',
        details: `Package: ${formData.packageName}
Travelers: ${formData.travellers}
Budget: ${formData.budget || 'Not specified'}
Travel Date: ${formData.travelDate || 'Not specified'}
Message: ${formData.message || 'No additional message'}`
      };

      console.log('Submitting package enquiry:', enquiryData);

      // Send to backend
      const response = await API.post("/enquiry", enquiryData);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Package enquiry submitted successfully! Our team will contact you within 1-2 hours.'
        });

        // Reset form
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            travellers: "1",
            budget: "",
            travelDate: "",
            message: "",
            packageName: selectedPackage?.title || ""
          });
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to submit enquiry');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to submit enquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Enquire About This Package</h3>
            <p className="text-orange-100 text-sm">{selectedPackage?.title}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {submitStatus.type && (
          <div className={`p-4 ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl`}>
            <div className="flex items-center gap-3">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {submitStatus.message}
              </p>
            </div>
          </div>
        )}

        {/* Package Info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <PackageIcon className="text-orange-500" size={20} />
            <div>
              <p className="font-medium text-gray-900">{selectedPackage?.title}</p>
              <p className="text-sm text-gray-600">{selectedPackage?.location || selectedPackage?.destination} • {selectedPackage?.days || selectedPackage?.duration} days</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="travellers"
                value={formData.travellers}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Budget (per person)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., ₹25,000"
              />
            </div>
          </div>

          {/* Travel Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Preferred Travel Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Additional Requirements
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Any special requests, dietary requirements, or additional information..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Enquiry
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            <Shield className="inline mr-1" size={12} />
            Your information is secure. We'll contact you within 1-2 hours.
          </p>
        </div>
      </form>
    </div>
  );
};

// ================= COMPONENTS =================

const HeroSection = ({ scrollToPackages, scrollToCarousel }) => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24">
        {/* Coming Soon Heading - Inside the purple theme */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="animate-pulse">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
              COMING SOON
            </h2>
            <div className="animate-pulse">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
          </div>
          <p className="text-xl text-blue-100 mb-4">
            Exciting new features and destinations are on the way!
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            Stay tuned for amazing updates. In the meantime, explore our current packages or request a custom trip.
          </p>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm font-medium">10+ Curated Tour Packages</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover Amazing
            <span className="block text-orange-300 mt-2">Travel Experiences</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Choose from our 6+ expertly curated tour packages or let us design a fully customized itinerary just for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={scrollToCarousel}
              className="group relative bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
              <Globe className="relative z-10 group-hover:animate-pulse" size={22} /> 
              <span className="relative z-10">View Packages</span>
            </button>
            <button 
              onClick={scrollToPackages}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
              <Grid className="relative z-10 group-hover:animate-pulse" size={22} /> 
              <span className="relative z-10">Browse All</span>
            </button>
            <a 
              href="https://wa.me/916371106588"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
              <MessageCircle className="relative z-10" size={22} /> 
              <span className="relative z-10">Custom Trip</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Award size={20} />, text: "Packages", color: "text-yellow-400" },
              { icon: <Shield size={20} />, text: "Flexible Plans", color: "text-green-400" },
              { icon: <TrendingUp size={20} />, text: "Best Value", color: "text-pink-400" },
              { icon: <Clock size={20} />, text: "24/7 Support", color: "text-blue-400" },
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className={`${badge.color}`}>{badge.icon}</div>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Grid = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

// Package Type Filters Component
const PackageTypeFilter = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "All Packages", icon: <Globe size={16} />, count: 10 },
    { id: "domestic", label: "Domestic", icon: <MapPin size={16} />, count: 6 },
    { id: "international", label: "International", icon: <Globe size={16} />, count: 4 },
    { id: "honeymoon", label: "Honeymoon", icon: <Heart size={16} />, count: 3 },
    { id: "adventure", label: "Adventure", icon: <Mountain size={16} />, count: 4 },
    { id: "family", label: "Family", icon: <Users size={16} />, count: 5 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            activeFilter === filter.id
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <span className={activeFilter === filter.id ? "text-white" : "text-gray-500"}>
            {filter.icon}
          </span>
          <span className="font-medium">{filter.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeFilter === filter.id 
              ? "bg-white/20 text-white" 
              : "bg-gray-100 text-gray-600"
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// QuickStats Component
const QuickStats = () => {
  const stats = [
    { 
      value: "6+", 
      label: "Curated Packages",
      icon: <Globe className="text-indigo-500" size={20} />,
      desc: "Domestic & international"
    },
    { 
      value: "15+", 
      label: "Destinations",
      icon: <MapPin className="text-green-500" size={20} />,
      desc: "Across India & abroad"
    },
    { 
      value: "95%", 
      label: "Satisfaction",
      icon: <Star className="text-yellow-500" size={20} />,
      desc: "Rated 4.5+ stars"
    },
    { 
      value: "Custom", 
      label: "Trip Planning",
      icon: <Sparkles className="text-pink-500" size={20} />,
      desc: "Fully personalized"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white rounded-2xl transform group-hover:scale-105 transition-all duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 group-hover:border-indigo-300/50 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= PACKAGE CARD COMPONENT =================

const PackageCard = ({ pkg, onEnquire }) => {
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  const handleEnquire = () => {
    setShowEnquiryForm(true);
    if (onEnquire) onEnquire(pkg);
  };

  return (
    <>
      <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200/50 group-hover:border-orange-300 transition-all duration-500 shadow-sm group-hover:shadow-2xl">
        <div className="relative h-64 overflow-hidden">
          <img
            src={pkg.imageUrl || pkg.image || pkg.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200"}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-xs font-bold rounded-full">
              {pkg.tag || pkg.category || "Popular"}
            </span>
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
              <Clock size={14} />
              <span>{pkg.days || pkg.duration} days</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                {pkg.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin size={14} />
                <span>{pkg.location || pkg.destination}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">4.5</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {pkg.description || "Experience amazing destinations with our expertly curated package."}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{pkg.priceFrom?.toLocaleString() || pkg.price?.toLocaleString() || "On Request"}
              </div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEnquire}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageCircle size={18} />
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEnquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full">
            <PackageEnquiryForm 
              selectedPackage={pkg}
              onClose={() => setShowEnquiryForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

// ================= CUSTOM PACKAGE CTA =================

const CustomPackageCTA = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 items-center">
              <div className="p-8 md:p-12 text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles size={16} className="text-yellow-300" />
                  <span className="text-sm font-medium">Custom Trip Planning</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Don't See What You're Looking For?
                </h2>
                <p className="text-blue-100 mb-8">
                  Let our travel experts design a completely personalized itinerary tailored to your preferences, budget, and schedule.
                </p>
                <div className="space-y-4">
                  {[
                    "100% Customizable itineraries",
                    "Flexible dates & destinations",
                    "Personal travel consultant",
                    "Best price guarantee"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Custom Package</h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Get Custom Quote
                </button>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Our travel expert will contact you within 1 hour
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Custom Package Request</h3>
                    <p className="text-indigo-100 text-sm">Tell us your dream trip details</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white hover:text-indigo-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <a
                  href="https://wa.me/916371106588?text=Hi,%20I%20want%20a%20custom%20travel%20package.%20Please%20contact%20me."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 mb-4"
                >
                  <MessageCircle size={20} />
                  WhatsApp for Custom Package
                </a>
                
                <p className="text-sm text-gray-600 text-center">
                  For custom packages, we prefer to discuss details directly on WhatsApp for better planning.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <Phone className="inline mr-2 text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Or call: +91 90238 84833</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ================= 10 DEMO PACKAGES =================

const getDemoPackages = () => [
  {
    _id: "1",
    title: "Kashmir Paradise Tour",
    location: "Srinagar, Gulmarg, Pahalgam",
    description: "Experience the beauty of Kashmir with houseboat stays, shikara rides, and snow adventures in the Himalayas.",
    days: 7,
    priceFrom: 25000,
    tag: "Honeymoon",
    imageUrl: "https://media.istockphoto.com/id/498628231/photo/lake-of-blue-water.webp?a=1&b=1&s=612x612&w=0&k=20&c=JWajlJmK-qq7ITeu1m0KJeqA-hUu731rQpgJ3g2rAyY=",
    highlights: ["Houseboat Stay", "Shikara Ride", "Skiing in Gulmarg", "Pahalgam Valley"]
  },
  {
    _id: "2",
    title: "Goa Beach & Culture",
    location: "North Goa, South Goa",
    description: "Sun, sand, and Portuguese heritage with beach shacks, water sports, and vibrant nightlife.",
    days: 5,
    priceFrom: 18000,
    tag: "Beach",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200",
    highlights: ["Beach Hopping", "Water Sports", "Portuguese Churches", "Nightlife"]
  },
  {
    _id: "4",
    title: "Kerala Backwaters",
    location: "Alleppey, Munnar, Kochi",
    description: "Houseboat cruise through backwaters, tea plantations, and Ayurvedic wellness treatments.",
    days: 6,
    priceFrom: 22000,
    tag: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200",
    highlights: ["Houseboat Stay", "Tea Plantations", "Ayurvedic Spa", "Kathakali Show"]
  },
  {
    _id: "5",
    title: "Rajasthan Royal Heritage",
    location: "Jaipur, Udaipur, Jodhpur",
    description: "Palaces, forts, desert safaris, and cultural experiences in royal Rajasthan.",
    days: 8,
    priceFrom: 28000,
    tag: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&auto=format&fit=crop&q=60",
    highlights: ["Palace Stay", "Desert Safari", "Folk Performances", "Shopping"]
  },
  {
    _id: "7",
    title: "Ladakh Adventure",
    location: "Leh, Nubra Valley, Pangong",
    description: "High altitude lakes, monasteries, mountain passes, and adventure activities in Ladakh.",
    days: 9,
    priceFrom: 32000,
    tag: "Adventure",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
    highlights: ["Pangong Lake", "Monastery Tour", "Mountain Biking", "Camping"]
  },
  {
    _id: "10",
    title: "Himachal Hill Stations",
    location: "Shimla, Manali, Dharamshala",
    description: "Hill stations, mountain views, adventure sports, and Tibetan culture experiences.",
    days: 7,
    priceFrom: 24000,
    tag: "Family",
    imageUrl: "https://images.unsplash.com/photo-1581791534721-e599df4417f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGltYWNoYWx8ZW58MHx8MHx8fDA%3D0",
    highlights: ["Toy Train", "Skiing", "Tibetan Culture", "River Rafting"]
  }
];

// ================= MAIN COMPONENT =================

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching packages from API...");
        
        const response = await API.get("/packages");
        console.log("API Response status:", response.status);
        console.log("API Response data:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Transform data to ensure it has all required fields
          const transformedPackages = response.data.map(pkg => ({
            _id: pkg._id || pkg.id || Math.random().toString(36).substr(2, 9),
            id: pkg.id || pkg._id || Math.random().toString(36).substr(2, 9),
            title: pkg.title || "Untitled Package",
            location: pkg.location || pkg.destination || "Unknown Location",
            destination: pkg.destination || pkg.location || "Unknown Destination",
            description: pkg.description || `${pkg.title} - Experience amazing destinations`,
            days: pkg.days || pkg.duration || 5,
            duration: pkg.duration || pkg.days || 5,
            priceFrom: pkg.priceFrom || pkg.price || 10000,
            price: pkg.price || pkg.priceFrom || 10000,
            tag: pkg.tag || pkg.category || "Popular",
            category: pkg.category || pkg.tag || "Popular",
            imageUrl: pkg.imageUrl || pkg.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200",
            image: pkg.image || pkg.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200",
            images: pkg.images || [pkg.imageUrl] || ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200"],
            highlights: pkg.highlights || ["Scenic Views", "Cultural Experience", "Comfortable Stay"]
          }));
          
          setPackages(transformedPackages);
          setFilteredPackages(transformedPackages);
          console.log("Packages loaded from backend:", transformedPackages.length);
          
          if (transformedPackages.length === 0) {
            console.log("No packages from backend, loading demo data");
            loadDemoPackages();
          }
        } else {
          console.log("Invalid response format, loading demo data");
          loadDemoPackages();
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        console.log("Error details:", error.response?.data);
        setError(`Failed to load packages from server: ${error.message}`);
        
        // Use demo packages as fallback
        loadDemoPackages();
      } finally {
        setIsLoading(false);
      }
    };

    const loadDemoPackages = () => {
      const demoPackages = getDemoPackages();
      setPackages(demoPackages);
      setFilteredPackages(demoPackages);
      console.log("Using demo packages:", demoPackages.length);
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages;
    
    if (activeFilter !== "all") {
      filtered = filtered.filter(pkg => 
        pkg.tag?.toLowerCase() === activeFilter || 
        pkg.category?.toLowerCase() === activeFilter
      );
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.title?.toLowerCase().includes(term) ||
        pkg.location?.toLowerCase().includes(term) ||
        pkg.description?.toLowerCase().includes(term) ||
        pkg.tag?.toLowerCase().includes(term)
      );
    }
    
    setFilteredPackages(filtered);
  }, [packages, activeFilter, searchTerm]);

  const scrollToPackages = () => {
    document.getElementById('packages-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCarousel = () => {
    document.getElementById('circular-carousel')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquireClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowEnquiryForm(true);
  };

  // Debug component to see what's happening
  const DebugInfo = () => {
    return (
      <div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Debug info - remove in production */}
      <DebugInfo />
      
      <HeroSection scrollToPackages={scrollToPackages} scrollToCarousel={scrollToCarousel} />
      <QuickStats />
      
      {/* Circular Carousel Section */}
      <section id="circular-carousel" className="py-16 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 mb-4">
            <Sparkles size={16} className="text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700">Featured Packages</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Top Destinations</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our most popular packages with interactive circular carousel
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading amazing packages...</p>
          </div>
        ) : packages.length > 0 ? (
          <CircularCarousel packages={packages.slice(0, 8)} />
        ) : (
          <div className="text-center py-12">
            <Globe size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No packages available yet</p>
          </div>
        )}
      </section>
      
      {/* Package Filter */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <PackageTypeFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>
      
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 mt-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search packages by destination, theme, or duration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-700">
              ⚠️ {error}. Showing demo packages. Check if backend is running on port 5000.
            </p>
          </div>
        </div>
      )}
      
      {/* Packages Grid Section */}
      <section id="packages-grid" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50">
              <Globe size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No packages match "${searchTerm}". Try a different search or browse all packages.`
                  : "Packages will be added soon. Contact us for custom trip planning."
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchTerm("");
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
                >
                  View All Packages
                </button>
                <a
                  href="https://wa.me/916371106588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp for Custom Trip
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    All Packages
                  </h2>
                  <p className="text-gray-600">
                    {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
                    {packages.length === getDemoPackages().length && " (Demo Data)"}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} onEnquire={handleEnquireClick} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Custom Package CTA */}
      <CustomPackageCTA />
      
      {/* Enquiry Form Modal */}
      {showEnquiryForm && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <PackageEnquiryForm 
              selectedPackage={selectedPackage}
              onClose={() => {
                setShowEnquiryForm(false);
                setSelectedPackage(null);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/916371106588"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-lg group-hover:blur-xl transition-all opacity-70"></div>
          <div className="relative bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110">
            <MessageCircle size={28} />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Packages;