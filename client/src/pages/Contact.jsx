import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Send,
  User,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  Headphones,
  ChevronRight
} from "lucide-react";
import { API } from "../api.js";

// ========== CONFIGURATION ==========
const BUSINESS_CONFIG = {
  phone: "+919023884833",
  whatsapp: "+916371106588",
  email: "support@triproute.com",
  whatsappMessage: "Hi, I need travel assistance from TripRoute",
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    linkedin: "#"
  }
};

const SERVICE_TYPES = [
  "Cab & Vehicle Rental",
  "Train Ticket Assistance",
  "Flight Booking",
  "Tour Packages",
  "Hotel Booking",
  "Visa Assistance",
  "Travel Insurance",
  "Corporate Travel",
  "Custom Itinerary",
  "General Inquiry"
];

// ========== VALIDATION UTILITIES ==========
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

const validateMessage = (message) => {
  return message.trim().length >= 10;
};

// ========== COMPONENTS ==========

const SuccessModal = ({ isOpen, onClose, onContinueWhatsApp }) => {
  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(BUSINESS_CONFIG.whatsappMessage);
    window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Our travel expert will review your enquiry and contact you within 1 hour.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <MessageCircle size={20} />
              Continue on WhatsApp
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-700 hover:text-gray-900 font-medium"
            >
              Close
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <Clock className="inline mr-2" size={14} />
              Response time: 15 min (WhatsApp) • 1 hour (Email)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickContactCard = ({ icon, title, description, actionText, actionUrl, gradient }) => {
  const handleClick = () => {
    if (actionUrl.includes('mailto:')) {
      window.location.href = actionUrl;
    } else if (actionUrl.includes('tel:')) {
      window.location.href = actionUrl;
    } else {
      window.open(actionUrl, '_blank');
    }
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-xl transform group-hover:scale-105 transition-all duration-300 shadow-sm"></div>
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 group-hover:border-blue-300/50 transition-all">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${gradient} mb-4`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button
          onClick={handleClick}
          className="w-full py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg font-medium hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200 group-hover:border-blue-300"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const quickContacts = [
    {
      icon: <MessageCircle className="text-white" size={22} />,
      title: "WhatsApp Chat",
      description: "Instant response, document sharing",
      actionText: "Chat Now",
      actionUrl: `https://wa.me/${BUSINESS_CONFIG.whatsapp}`,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Phone className="text-white" size={22} />,
      title: "Call Expert",
      description: "Detailed discussion, 24/7 support",
      actionText: "Call Now",
      actionUrl: `tel:${BUSINESS_CONFIG.phone}`,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Mail className="text-white" size={22} />,
      title: "Email Us",
      description: "Detailed queries, document attachments",
      actionText: "Send Email",
      actionUrl: `mailto:${BUSINESS_CONFIG.email}`,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(form.name)) {
      newErrors.name = "Please enter a valid name (min 2 characters)";
    }

    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!form.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }

    if (!validateMessage(form.message)) {
      newErrors.message = "Please provide more details (min 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Prepare data for enquiry endpoint
      const enquiryData = {
        name: form.name,
        service: form.serviceType,
        phone: form.phone,
        email: form.email,
        details: form.message
      };

      console.log('Submitting contact enquiry:', enquiryData);

      // Send to backend API
      const response = await API.post("/enquiry", enquiryData);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Enquiry submitted successfully!'
        });
        
        // Show success modal
        setShowSuccessModal(true);

        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          message: "",
        });
        setErrors({});

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

  const closeNotification = () => {
    setSubmitStatus({ type: null, message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Notification Banner */}
      {submitStatus.type && (
        <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl shadow-lg p-4 transition-all duration-300`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {submitStatus.type === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className={`text-sm mt-1 ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {submitStatus.message}
                </p>
              </div>
            </div>
            <button
              onClick={closeNotification}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Expert Travel Support</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Our
              <span className="block text-blue-300 mt-2">Travel Experts</span>
            </h1>
            
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Get personalized assistance for all your travel needs
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Options */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {quickContacts.map((contact, idx) => (
              <QuickContactCard key={idx} {...contact} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Enquiry Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Detailed Enquiry Form</h2>
                  <p className="text-blue-100">Our expert will personally review your request</p>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-yellow-300" />
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Form-level success/error messages */}
              {submitStatus.type && (
                <div className={`p-4 ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl`}>
                  <div className="flex items-center gap-3">
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p className={`font-medium ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Service Needed *
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="serviceType"
                      value={form.serviceType}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-10 py-3 rounded-xl border ${
                        errors.serviceType ? 'border-red-500' : 'border-gray-300'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors appearance-none cursor-pointer`}
                    >
                      <option value="">Select a service</option>
                      {SERVICE_TYPES.map((service, idx) => (
                        <option key={idx} value={service}>{service}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 rotate-90" size={18} />
                  </div>
                  {errors.serviceType && (
                    <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none`}
                  placeholder="Please provide details about your travel plans, dates, budget, and specific requirements..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Provide as much detail as possible for better assistance
                </p>
              </div>

              {/* Trust Note */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Your information is secure</p>
                    <p className="text-sm text-gray-600">
                      We respect your privacy. Your details are encrypted and never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Enquiry
                  </>
                )}
              </button>

              {/* Alternative Options */}
              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Prefer to talk?{' '}
                  <a
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    WhatsApp us directly
                    <MessageCircle size={16} />
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Simple Response Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Response Time</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">WhatsApp</span>
                  <span className="font-medium text-green-600">15 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone Calls</span>
                  <span className="font-medium text-blue-600">Instant</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-purple-600">1 hour</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Headphones className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">24/7 Emergency Support</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                For urgent travel issues, cancellations, or immediate assistance
              </p>
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Phone size={16} />
                Call +91 63711 06588
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        onContinueWhatsApp={() => {
          const message = encodeURIComponent(BUSINESS_CONFIG.whatsappMessage);
          window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${message}`, '_blank');
          setShowSuccessModal(false);
        }}
      />
    </div>
  );
};

export default Contact;