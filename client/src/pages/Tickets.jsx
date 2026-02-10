// client/src/pages/Ticket.jsx
import React, { useState, useEffect } from "react";
import { API } from "../api.js";
import { 
  Train, 
  Calendar, 
  Users, 
  Phone, 
  MapPin,
  Clock,
  Zap,
  Sparkles,
  MessageCircle,
  ArrowRightLeft,
  Star,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Target,
  CheckCircle,
  Loader2,
  Ticket as TicketIcon,
  Mail,
  AlertCircle,
  ArrowUpDown,
  Check,
  Navigation,
  Plane,
  User,
  Globe
} from "lucide-react";

const Tickets = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    serviceType: "Normal",
    passengers: "1",
    phone: "",
    email: "",
    travelClass: "",
    preferredTime: "",
    specialRequest: "",
    // Flight specific fields
    tripType: "One Way",
    flightClass: "Economy",
    returnDate: ""
  });

  // Initialize passenger names based on default passenger count
  const [passengerNames, setPassengerNames] = useState(() => {
    const initialCount = parseInt(form.passengers) || 1;
    return Array(initialCount).fill("");
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [ticketType, setTicketType] = useState("train"); // "train" or "flight"

  // Service type options for train tickets
  const TRAIN_SERVICE_TYPES = ["Normal", "Tatkal", "Premium Tatkal", "Emergency"];
  
  // Class options for train tickets
  const TRAIN_CLASS_OPTIONS = [
    "Sleeper (SL)",
    "3A (AC 3 Tier)",
    "2A (AC 2 Tier)",
    "1A (AC First Class)",
    "CC (Chair Car)",
    "EC (Executive Chair Car)",
    "2S (Second Seating)"
  ];

  // Trip type options for flights
  const FLIGHT_TRIP_TYPES = ["One Way", "Round Trip", "Multi City"];
  
  // Class options for flights
  const FLIGHT_CLASS_OPTIONS = ["Economy", "Premium Economy", "Business", "First Class"];

  // Initialize passenger names when component mounts
  useEffect(() => {
    const initialCount = parseInt(form.passengers) || 1;
    if (passengerNames.length !== initialCount) {
      setPassengerNames(Array(initialCount).fill(""));
    }
  }, []);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.from.trim()) newErrors.from = "From location is required";
    if (!form.to.trim()) newErrors.to = "To location is required";
    
    // Case-insensitive comparison
    if (form.from.trim().toLowerCase() === form.to.trim().toLowerCase()) {
      newErrors.to = "From and To cannot be same";
    }
    
    if (!form.date) {
      newErrors.date = "Travel date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }
    
    // For round trips, return date is required
    if (ticketType === "flight" && form.tripType === "Round Trip") {
      if (!form.returnDate) {
        newErrors.returnDate = "Return date is required for round trip";
      } else {
        const departureDate = new Date(form.date);
        const returnDate = new Date(form.returnDate);
        if (returnDate < departureDate) {
          newErrors.returnDate = "Return date must be after departure date";
        }
      }
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = form.phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
        newErrors.phone = "Enter a valid 10-digit Indian mobile number";
      }
    }
    
    // Passenger names validation
    passengerNames.forEach((name, index) => {
      if (!name.trim()) {
        newErrors[`passenger_${index}`] = `Passenger ${index + 1} name is required`;
      }
    });
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (name === "passengers") {
      const count = Math.max(1, Math.min(6, parseInt(value) || 1));
      
      // Adjust passenger names array based on new count
      const newNames = [...passengerNames];
      if (count > newNames.length) {
        // Add empty strings for new passengers
        while (newNames.length < count) {
          newNames.push("");
        }
      } else if (count < newNames.length) {
        // Remove extra passengers
        newNames.length = count;
      }
      setPassengerNames(newNames);
      
      // Clear any existing passenger name errors
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('passenger_')) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const handlePassengerNameChange = (index, value) => {
    const updatedNames = [...passengerNames];
    updatedNames[index] = value;
    setPassengerNames(updatedNames);
    
    if (errors[`passenger_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`passenger_${index}`];
      setErrors(newErrors);
    }
  };

  const switchLocations = () => {
    setForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
    
    // Clear location errors
    setErrors(prev => ({
      ...prev,
      from: "",
      to: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus({
        type: "error",
        message: "Please fix the errors below"
      });
      
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      let element;
      
      if (firstError.startsWith('passenger_')) {
        const index = firstError.split('_')[1];
        element = document.querySelector(`[data-passenger-index="${index}"]`);
      } else {
        element = document.querySelector(`[name="${firstError}"]`);
      }
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    setStatus({ type: "loading", message: "Submitting your enquiry..." });

    try {
      // Prepare payload - match backend field names
      const payload = {
        from: form.from,
        to: form.to,
        date: form.date,
        passengers: form.passengers,
        passengerNames: passengerNames.filter(name => name.trim()),
        phone: form.phone,
        email: form.email,
        preferredTime: form.preferredTime,
        specialRequest: form.specialRequest,
        // Use ticketMode instead of ticketType to avoid confusion
        ticketMode: ticketType, // "train" or "flight"
        source: "website_form"
      };

      // Add ticket type specific fields
      if (ticketType === "train") {
        payload.serviceType = form.serviceType;
        payload.travelClass = form.travelClass;
      } else {
        payload.tripType = form.tripType;
        payload.flightClass = form.flightClass;
        if (form.returnDate) {
          payload.returnDate = form.returnDate;
        }
      }

      // Remove empty fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });

      console.log("Sending payload to backend:", payload);
      
      // Make sure API is pointing to correct endpoint
      await API.post("/tickets", payload);
      
      // Create WhatsApp message with passenger names
      const passengerList = passengerNames.map((name, index) => 
        `${index + 1}. ${name.trim()}`
      ).join('\n');
      
      const message = ticketType === "train" 
        ? `🎫 New Train Ticket Enquiry!\n\nFrom: ${form.from}\nTo: ${form.to}\nDate: ${form.date}\nPassengers (${form.passengers}):\n${passengerList}\nPhone: ${form.phone}\nService: ${form.serviceType}\nClass: ${form.travelClass || "Not specified"}`
        : `✈️ New Flight Ticket Enquiry!\n\nFrom: ${form.from}\nTo: ${form.to}\nDate: ${form.date}\nTrip: ${form.tripType}\nPassengers (${form.passengers}):\n${passengerList}\nPhone: ${form.phone}\nClass: ${form.flightClass}\n${form.returnDate ? `Return: ${form.returnDate}` : ''}`;
      
      const whatsappUrl = `https://wa.me/919023884833?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setStatus({
        type: "success",
        message: `✅ ${ticketType === "train" ? "Train" : "Flight"} ticket enquiry submitted! Our expert will contact you within 15 minutes.`
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        const resetForm = {
          from: "",
          to: "",
          date: "",
          serviceType: "Normal",
          passengers: "1",
          phone: "",
          email: "",
          travelClass: "",
          preferredTime: "",
          specialRequest: "",
          tripType: "One Way",
          flightClass: "Economy",
          returnDate: ""
        };
        
        setForm(resetForm);
        // Reinitialize passenger names with 1 passenger
        setPassengerNames([""]);
        setErrors({});
        setIsSubmitting(false);
      }, 5000);

    } catch (err) {
      console.error("Ticket enquiry failed:", err);
      console.error("Error details:", err.response?.data || err.message);
      setStatus({
        type: "error",
        message: `❌ Something went wrong: ${err.response?.data?.message || err.message}`
      });
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Reset form when switching ticket types
  const handleTicketTypeChange = (type) => {
    setTicketType(type);
    const resetForm = {
      from: "",
      to: "",
      date: "",
      serviceType: "Normal",
      passengers: "1",
      phone: "",
      email: "",
      travelClass: "",
      preferredTime: "",
      specialRequest: "",
      tripType: "One Way",
      flightClass: "Economy",
      returnDate: ""
    };
    setForm(resetForm);
    // Keep passenger names with 1 passenger
    setPassengerNames([""]);
    setErrors({});
    setStatus({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Dark Bluish Theme */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-blue-300" />
              <span className="text-sm font-medium">Travel Ticket Enquiry</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Get Confirmed
              <span className="block text-blue-300 mt-2">Travel Tickets</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Expert assistance for train and flight bookings across India and worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => {
                  const formElement = document.getElementById('enquiry-form');
                  if (formElement) {
                    formElement.scrollIntoView({behavior: 'smooth'});
                  }
                }}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                <TicketIcon className="relative z-10 group-hover:animate-pulse" size={22} /> 
                <span className="relative z-10">Enquire for Tickets</span>
              </button>
              <a 
                href="https://wa.me/919023884833"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                <MessageCircle className="relative z-10" size={22} /> 
                <span className="relative z-10">Instant WhatsApp Quote</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: <ShieldCheck size={20} />, text: "Verified Service", color: "text-blue-400" },
                { icon: <Clock size={20} />, text: "Quick Response", color: "text-indigo-400" },
                { icon: <TrendingUp size={20} />, text: "Best Price", color: "text-teal-400" },
                { icon: <Target size={20} />, text: "High Success Rate", color: "text-purple-400" },
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

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              value: "100+", 
              label: "Happy Travelers",
              icon: <Users className="text-blue-500" size={20} />,
              desc: "Trusted service"
            },
            { 
              value: "99.2%", 
              label: "Success Rate",
              icon: <Target className="text-indigo-500" size={20} />,
              desc: "Confirmed tickets"
            },
            { 
              value: "15-20 min", 
              label: "Avg Response",
              icon: <Clock className="text-teal-500" size={20} />,
              desc: "Quick replies"
            },
            { 
              value: "24/7", 
              label: "Support",
              icon: <PhoneCall className="text-blue-500" size={20} />,
              desc: "Always available"
            },
          ].map((stat, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl transform group-hover:scale-105 transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 group-hover:border-blue-300/50 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-white rounded-xl">
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

      {/* Benefits Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-4 py-2 mb-4">
              <Star size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Why Choose Us</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Travel Advantage</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert assistance for all your train and flight ticket needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <ShieldCheck className="text-blue-600" size={24} />,
                title: "Expert Assistance",
                description: "Our travel experts have 10+ years experience in finding confirmed tickets",
                features: ["Tatkal booking experts", "Best flight deals", "Seat optimization"]
              },
              {
                icon: <TrendingUp className="text-indigo-600" size={24} />,
                title: "Best Price Guarantee",
                description: "We compare multiple options to ensure you get the best fares",
                features: ["No hidden charges", "Transparent pricing", "Price match guarantee"]
              },
              {
                icon: <Clock className="text-teal-600" size={24} />,
                title: "Quick Response",
                description: "Get options within 15 minutes. 24/7 service available",
                features: ["Instant WhatsApp replies", "Flight tracking", "Emergency booking"]
              },
              {
                icon: <CheckCircle className="text-purple-600" size={24} />,
                title: "100% Verified",
                description: "Safe and secure ticket booking with verified partners",
                features: ["Secure payment", "Ticket verification", "Booking confirmation"]
              }
            ].map((benefit, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-300 shadow-sm group-hover:shadow-lg"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 group-hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 mb-4">{benefit.description}</p>
                      <div className="space-y-2">
                        {benefit.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <Check size={14} className="text-blue-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="enquiry-form" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-4 py-2 mb-4">
              <Zap size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Quick & Easy Enquiry</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Custom Quote</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill in your journey details and receive the best options from our travel experts
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Travel Ticket Enquiry Form</h3>
                  <p className="text-blue-100">Get expert assistance for confirmed tickets</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-300" />
                  <span className="text-sm font-medium text-white">Quick Response Guaranteed</span>
                </div>
              </div>

              {/* Ticket Type Toggle */}
              <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-xl p-1 max-w-md">
                <button
                  type="button"
                  onClick={() => handleTicketTypeChange("train")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    ticketType === "train" 
                      ? "bg-white text-blue-600 shadow-lg" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Train size={20} />
                  Train Tickets
                </button>
                <button
                  type="button"
                  onClick={() => handleTicketTypeChange("flight")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    ticketType === "flight" 
                      ? "bg-white text-blue-600 shadow-lg" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Plane size={20} />
                  Flight Tickets
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Journey Details Card */}
              <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    {ticketType === "train" ? <Train size={24} className="text-blue-600" /> : <Plane size={24} className="text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {ticketType === "train" ? "Train Journey Details" : "Flight Journey Details"}
                    </h3>
                    <p className="text-gray-600">
                      {ticketType === "train" ? "Where and when you want to travel by train" : "Where and when you want to fly"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* From/To Locations */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        {ticketType === "train" ? "From Station *" : "From City/Airport *"}
                      </label>
                      <div className="relative">
                        <input
                          name="from"
                          value={form.from}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.from ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                          placeholder={ticketType === "train" ? "Enter departure station" : "Enter departure city or airport"}
                        />
                        {ticketType === "train" ? (
                          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        ) : (
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        )}
                      </div>
                      {errors.from && (
                        <p className="text-red-500 text-sm mt-1">{errors.from}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Navigation size={16} className="text-indigo-500" />
                        {ticketType === "train" ? "To Station *" : "To City/Airport *"}
                      </label>
                      <div className="relative">
                        <input
                          name="to"
                          value={form.to}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.to ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                          placeholder={ticketType === "train" ? "Enter destination station" : "Enter destination city or airport"}
                        />
                        {ticketType === "train" ? (
                          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        ) : (
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        )}
                      </div>
                      {errors.to && (
                        <p className="text-red-500 text-sm mt-1">{errors.to}</p>
                      )}
                    </div>
                  </div>

                  {/* Switch Locations Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={switchLocations}
                      className="p-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 transition-all"
                    >
                      <ArrowUpDown size={20} />
                    </button>
                  </div>

                  {/* Date and Service/Trip Type */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-500" />
                        {ticketType === "train" ? "Travel Date *" : "Departure Date *"}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          min={getMinDate()}
                          className={`w-full rounded-xl border ${errors.date ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                          required
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                      )}
                    </div>

                    {ticketType === "train" ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Zap size={16} className="text-teal-500" />
                          Service Type *
                        </label>
                        <div className="relative">
                          <select
                            name="serviceType"
                            value={form.serviceType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          >
                            {TRAIN_SERVICE_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                          <ArrowRightLeft size={16} className="text-teal-500" />
                          Trip Type *
                        </label>
                        <div className="relative">
                          <select
                            name="tripType"
                            value={form.tripType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          >
                            {FLIGHT_TRIP_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <ArrowRightLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Return Date for Flight Round Trip */}
                  {ticketType === "flight" && form.tripType === "Round Trip" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-500" />
                        Return Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="returnDate"
                          value={form.returnDate}
                          onChange={handleChange}
                          min={form.date || getMinDate()}
                          className={`w-full rounded-xl border ${errors.returnDate ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      {errors.returnDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>
                      )}
                    </div>
                  )}

                  {/* Class and Passengers */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {ticketType === "train" ? "Travel Class" : "Flight Class"}
                      </label>
                      <div className="relative">
                        <select
                          name={ticketType === "train" ? "travelClass" : "flightClass"}
                          value={ticketType === "train" ? form.travelClass : form.flightClass}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        >
                          <option value="">Select Class</option>
                          {ticketType === "train" 
                            ? TRAIN_CLASS_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))
                            : FLIGHT_CLASS_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))
                          }
                        </select>
                        {ticketType === "train" ? (
                          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        ) : (
                          <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        Passengers *
                      </label>
                      <div className="relative">
                        <select
                          name="passengers"
                          value={form.passengers}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        >
                          {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                          ))}
                        </select>
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Passenger Names - Always show for initial count */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Passenger Names *
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {passengerNames.map((name, index) => (
                        <div key={index} className="space-y-2">
                          <div className="relative">
                            <input
                              value={name}
                              onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                              data-passenger-index={index}
                              className={`w-full rounded-xl border ${errors[`passenger_${index}`] ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                              placeholder={`Passenger ${index + 1} Full Name`}
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          </div>
                          {errors[`passenger_${index}`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`passenger_${index}`]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl p-6 border border-indigo-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                    <PhoneCall size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
                    <p className="text-gray-600">Where should we contact you?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                          placeholder="Enter 10-digit mobile number"
                          required
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="your.email@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Time (Optional)
                    </label>
                    <input
                      type="time"
                      name="preferredTime"
                      value={form.preferredTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequest"
                      value={form.specialRequest}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Any special requirements or preferences..."
                    />
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">What happens next?</p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li>✓ Our {ticketType} ticket expert contacts you within 15 minutes</li>
                      <li>✓ Receive best available options & prices</li>
                      <li>✓ Get confirmed ticket booking assistance</li>
                      <li>✓ Professional service with 24/7 support</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status Display */}
              {status.message && (
                <div className={`rounded-xl p-4 border ${
                  status.type === "success" 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800" 
                    : status.type === "error"
                    ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800"
                    : "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800"
                }`}>
                  <div className="flex items-center gap-3">
                    {status.type === "success" ? (
                      <CheckCircle size={20} />
                    ) : status.type === "error" ? (
                      <AlertCircle size={20} />
                    ) : (
                      <Loader2 className="animate-spin" size={20} />
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-70 transition-all duration-300 hover:shadow-xl group"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin" size={20} />
                    Submitting Enquiry...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <MessageCircle size={20} />
                    Submit {ticketType === "train" ? "Train" : "Flight"} Ticket Enquiry
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              💬 Prefer to talk? WhatsApp us at{" "}
              <a href="https://wa.me/916371106588" className="text-blue-600 font-medium hover:text-blue-800">
                +91 63711 06588
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple process from enquiry to confirmed tickets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Submit Enquiry",
                description: "Fill the form with your journey details",
                icon: <TicketIcon size={24} />
              },
              {
                number: "02",
                title: "Expert Contact",
                description: "Get call from travel specialist within 15 min",
                icon: <Phone size={24} />
              },
              {
                number: "03",
                title: "Get Options",
                description: "Receive best available tickets & prices",
                icon: <CheckCircle size={24} />
              },
              {
                number: "04",
                title: "Confirm Booking",
                description: "Book tickets with 24/7 support",
                icon: <ShieldCheck size={24} />
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-12 left-3/4 w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200"></div>
                )}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      {step.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919023884833"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg group-hover:blur-xl transition-all opacity-70"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110">
            <MessageCircle size={28} />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Tickets;