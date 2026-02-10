import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Shield,
  Users,
  ChevronRight,
  Car,
  Ticket,
  Package,
  Clock,
  MessageCircle,
  Headphones,
  CheckCircle,
  Zap,
  Heart,
  Search,
  FileText,
  User,
  Calendar,
  Mail,
  Send,
  AlertCircle,
  X
} from "lucide-react";
import { API } from "../api.js";

const Home = () => {
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    service: "",
    phone: "",
    details: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // 'success' or 'error'
    message: ""
  });

  // Services data
  const services = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Cab & Vehicle Rentals",
      desc: "Assistance with local, outstation, and airport transfers across vehicle types.",
      features: ["Verified drivers", "Multiple vehicle options", "GPS tracking available"],
      link: "/cabs",
      color: "from-blue-600 to-cyan-500"
    },
    {
      icon: <Ticket className="w-8 h-8" />,
      title: "Ticket Assistance",
      desc: "Help with train, bus, and flight tickets including special quota requirements.",
      features: ["Normal & Tatkal", "All major airlines", "Seat selection help"],
      link: "/tickets",
      color: "from-purple-600 to-pink-500"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Tour Planning",
      desc: "Custom domestic and international tour packages with itinerary planning.",
      features: ["Tailored itineraries", "Accommodation help", "Activity planning"],
      link: "/packages",
      color: "from-orange-600 to-yellow-500"
    },
  ];

  // Contact options
  const contactOptions = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "WhatsApp Chat",
      desc: "Quick responses for enquiries and document sharing",
      action: () => window.open('https://wa.me/916371106588?text=Hi%20TripRoute,%20I%20need%20travel%20assistance', '_blank'),
      features: ["Instant messaging", "File sharing", "Quick queries"],
      color: "border-green-200 bg-green-50 hover:bg-green-100"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Consultation",
      desc: "Detailed discussion for complex travel requirements",
      action: () => window.location.href = 'tel:+919023884833',
      features: ["Personal attention", "Detailed planning", "Clarification"],
      color: "border-blue-200 bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Email Support",
      desc: "Comprehensive planning with detailed itineraries",
      action: () => window.location.href = 'mailto:support@triproute.com',
      features: ["Documented process", "Detailed responses", "Record keeping"],
      color: "border-purple-200 bg-purple-50 hover:bg-purple-100"
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: "01",
      title: "Share Your Requirements",
      desc: "Tell us about your travel plans, dates, and preferences"
    },
    {
      step: "02",
      title: "Agent Review & Verification",
      desc: "Our experts check availability and suitable options"
    },
    {
      step: "03",
      title: "Receive Options & Details",
      desc: "Get comprehensive information to make decisions"
    },
    {
      step: "04",
      title: "Proceed with Confidence",
      desc: "Move forward only when you're fully satisfied"
    },
  ];

  // Benefits
  const benefits = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Detailed Documentation",
      desc: "Clear records of all communications and options"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Minimization",
      desc: "Verified options to avoid travel issues"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Saving",
      desc: "Let experts handle research and verification"
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Basic validation
      if (!enquiryData.name || !enquiryData.service || !enquiryData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Phone number validation
      const phoneRegex = /^[+]?[0-9\s-]{10,}$/;
      if (!phoneRegex.test(enquiryData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      console.log('Submitting enquiry:', enquiryData);

      // Send to backend API
      const response = await API.post("/enquiry", enquiryData);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Enquiry submitted successfully! Our team will contact you within 1-2 hours.'
        });

        // Reset form
        setEnquiryData({
          name: "",
          service: "",
          phone: "",
          details: "",
          email: ""
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
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

  // Close notification
  const closeNotification = () => {
    setSubmitStatus({ type: null, message: "" });
  };

  // Scroll to enquiry form
  const scrollToEnquiry = () => {
    const enquirySection = document.getElementById('enquiry-form');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle service click with enquiry prefilling
  const handleServiceClick = (serviceType, e) => {
    e.preventDefault();
    setEnquiryData(prev => ({
      ...prev,
      service: serviceType
    }));
    scrollToEnquiry();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4 animate-pulse" />
                Expert-Assisted Travel Platform
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Travel Assistance
                <span className="block text-yellow-300 mt-2">
                  Made Personal
                </span>
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
                TripRoute provides human-powered assistance for cab rentals, train & flight tickets, 
                and custom tour packages. Real experts handle your travel enquiries.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={scrollToEnquiry}
                  className="group px-7 py-4 bg-white text-indigo-900 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <Search className="w-5 h-5" />
                  Start Your Enquiry
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>

                <Link
                  to="/contact"
                  className="px-7 py-4 border-2 border-white/60 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5" />
                  Speak with Expert
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                {[
                  ["Real Experts", "No automation"],
                  ["Transparent Process", "Clear updates"],
                  ["Multiple Channels", "Call/WhatsApp/Email"],
                ].map(([label, sub]) => (
                  <div key={label} className="text-center">
                    <p className="text-lg font-bold text-white">{label}</p>
                    <p className="text-sm text-blue-300">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600"
                  alt="Travel consultation session"
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl max-w-xs animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Heart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Personal Service</p>
                    <p className="text-xs text-slate-500">Dedicated agent handling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR APPROACH ================= */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Agent-Assisted",
                desc: "Real people handle your enquiries"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Transparent",
                desc: "Clear process with regular updates"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Verified Options",
                desc: "Manually checked by our team"
              },
              {
                icon: <Headphones className="w-6 h-6" />,
                title: "Full Support",
                desc: "Available through your journey"
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl mb-4">
                  <div className="text-indigo-600">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ENHANCED ================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How We Can Assist You
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Comprehensive travel assistance across multiple services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={(e) => handleServiceClick(service.title.toLowerCase().includes('cab') ? 'cab' : 
                  service.title.toLowerCase().includes('ticket') ? 'train' : 'tour', e)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-indigo-300 cursor-pointer"
              >
                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.desc}</p>
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-indigo-700 font-semibold group-hover:underline">
                    <span>Submit Enquiry</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENQUIRY PROCESS & FORM ================= */}
      <section id="enquiry-form" className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                Our Enquiry Process
              </h2>

              <div className="space-y-6">
                {processSteps.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-lg font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= FUNCTIONAL ENQUIRY FORM ================= */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h3 className="font-bold text-2xl mb-2">Quick Travel Enquiry</h3>
              <p className="text-slate-600 mb-8">Get assistance from our travel experts</p>
              
              <form onSubmit={handleSubmitEnquiry} className="space-y-6">
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

                {/* 1. Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={enquiryData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* 2. Service Required Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Service Required *
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select 
                      name="service"
                      value={enquiryData.service}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="Cab Rental">Cab Rental</option>
                      <option value="Train Ticket">Train Ticket Assistance</option>
                      <option value="Bus Ticket">Bus Ticket Assistance</option>
                      <option value="Flight Ticket">Flight Ticket Assistance</option>
                      <option value="Tour Package">Tour Package Enquiry</option>
                      <option value="Multiple">Multiple Services</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90" />
                  </div>
                </div>

                {/* 3. Phone/WhatsApp Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={enquiryData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Include country code. We'll contact you on WhatsApp</p>
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={enquiryData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Additional Information */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Information
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea
                      name="details"
                      value={enquiryData.details}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Travel date, pickup/drop location, number of people, budget (if any)"
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors resize-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">More details help us provide better assistance</p>
                </div>

                {/* Trust Badge */}
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-700">
                    <Shield className="inline w-4 h-4 mr-2 text-green-600" />
                    Handled by real travel experts • No automated pricing • No spam
                  </p>
                </div>

                {/* 5. Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Enquiry
                    </>
                  )}
                </button>

                {/* 6. Response Time Reassurance */}
                <p className="text-sm text-slate-500 text-center">
                  <Clock className="inline w-4 h-4 mr-2 text-indigo-600" />
                  Our team typically responds within 1–2 hours during business hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Our Service
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              What makes our travel assistance different
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-4">
                  <div className="text-indigo-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT OPTIONS ================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Connect with Our Experts
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose your preferred way to get travel assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`group rounded-2xl p-8 border-2 ${option.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left`}
              >
                <div className="inline-flex p-4 bg-white rounded-xl shadow-sm mb-6">
                  <div className="text-indigo-600">
                    {option.icon}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3">{option.title}</h3>
                <p className="text-slate-600 mb-6">{option.desc}</p>
                <div className="space-y-2 mb-8">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  Connect Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready for Personalized Travel Assistance?
            </h2>
            
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Experience travel planning with real experts, transparent processes, 
              and dedicated support throughout your journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={scrollToEnquiry}
                className="group px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-slate-100 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3"
              >
                <FileText className="w-5 h-5" />
                Start Your Enquiry
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Speak with Expert
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Transparent Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Expert Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Quick Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;