// client/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { API, getAdminHeaders } from "../api.js";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Users,
  Car,
  Ticket,
  Package,
  Eye,
  AlertCircle,
  RefreshCw,
  FileText,
  BarChart,
  PieChart,
  Bell,
  LogOut,
  User,
  Shield,
  Printer,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Clock as ClockIcon,
  Star,
  ShieldCheck,
  CheckSquare,
  Send,
  Copy,
  Archive,
  Trash2,
  Filter as FilterIcon,
  Settings,
  Grid,
  List,
  Target,
  Award,
  TrendingUp as UpTrend,
  TrendingDown as DownTrend,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Mail as Email,
  PhoneCall,
  Briefcase,
  Home,
  Plane,
  Train,
  Hotel,
  Map,
  Navigation,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Save,
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [cabs, setCabs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("daily"); // "daily", "all", "tickets", "cabs", "enquiries"
  const [statusFilter, setStatusFilter] = useState("pending"); // "pending", "confirmed", "rejected"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    daily: { total: 0, pending: 0, confirmed: 0, rejected: 0, revenue: 0 },
    overall: { total: 0, pending: 0, confirmed: 0, rejected: 0, revenue: 0 }
  });
  const [quickStats, setQuickStats] = useState({
    conversionRate: 0,
    topService: "Cab Booking",
    peakHour: "10:00 AM"
  });
  const navigate = useNavigate();

  const isAuthed = !!localStorage.getItem("adminToken");

  // Load data on mount
  useEffect(() => {
    if (!isAuthed) return;
    loadData();
    
    // Refresh every 2 minutes
    const interval = setInterval(() => {
      loadData();
    }, 120000);
    
    return () => clearInterval(interval);
  }, [isAuthed]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, cabsRes, enquiriesRes] = await Promise.all([
        API.get("/tickets", getAdminHeaders()),
        API.get("/cabs", getAdminHeaders()),
        API.get("/enquiry", getAdminHeaders()),
      ]);
      
      const ticketsData = ticketsRes.data?.data || [];
      const cabsData = cabsRes.data?.data || [];
      const enquiriesData = enquiriesRes.data?.data || [];
      
      setTickets(ticketsData);
      setCabs(cabsData);
      setEnquiries(enquiriesData);
      
      calculateStats(ticketsData, cabsData, enquiriesData);
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketsData, cabsData, enquiriesData) => {
    const allBookings = [...ticketsData, ...cabsData, ...enquiriesData];
    const today = new Date().toISOString().split('T')[0];
    
    // Daily bookings
    const dailyBookings = allBookings.filter(item => 
      new Date(item.createdAt).toISOString().split('T')[0] === today
    );
    
    const dailyRevenue = dailyBookings
      .filter(item => item.status === 'confirmed')
      .reduce((sum, item) => sum + (parseFloat(item.price) || parseFloat(item.estimatedCost) || 0), 0);
    
    const overallRevenue = allBookings
      .filter(item => item.status === 'confirmed')
      .reduce((sum, item) => sum + (parseFloat(item.price) || parseFloat(item.estimatedCost) || 0), 0);
    
    // Calculate conversion rate
    const confirmedCount = allBookings.filter(item => item.status === 'confirmed').length;
    const conversionRate = allBookings.length > 0 
      ? Math.round((confirmedCount / allBookings.length) * 100)
      : 0;
    
    // Find peak hour (simplified)
    const hourCounts = Array(24).fill(0);
    allBookings.forEach(booking => {
      const hour = new Date(booking.createdAt).getHours();
      hourCounts[hour]++;
    });
    const peakHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    const peakHour = `${peakHourIndex}:00`;
    
    // Find top service
    const serviceCounts = {};
    allBookings.forEach(booking => {
      const service = booking.service || (booking.carType ? 'Cab' : booking.ticketMode ? 'Ticket' : 'Enquiry');
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    const topService = Object.keys(serviceCounts).reduce((a, b) => serviceCounts[a] > serviceCounts[b] ? a : b, 'Cab Booking');
    
    setStats({
      daily: {
        total: dailyBookings.length,
        pending: dailyBookings.filter(item => item.status === 'pending').length,
        confirmed: dailyBookings.filter(item => item.status === 'confirmed').length,
        rejected: dailyBookings.filter(item => item.status === 'rejected').length,
        revenue: dailyRevenue
      },
      overall: {
        total: allBookings.length,
        pending: allBookings.filter(item => item.status === 'pending').length,
        confirmed: allBookings.filter(item => item.status === 'confirmed').length,
        rejected: allBookings.filter(item => item.status === 'rejected').length,
        revenue: overallRevenue
      }
    });
    
    setQuickStats({
      conversionRate,
      avgResponseTime: "2h 15m",
      topService,
      peakHour: `${peakHour} ${peakHourIndex < 12 ? 'AM' : 'PM'}`
    });
  };

  const updateStatus = async (type, id, newStatus) => {
    try {
      const endpoint = type === 'ticket' ? '/tickets' : type === 'cab' ? '/cabs' : '/enquiry';
      
      await API.put(`${endpoint}/${id}`, { status: newStatus }, getAdminHeaders());
      
      // Update local state
      if (type === 'ticket') {
        setTickets(prev => prev.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      } else if (type === 'cab') {
        setCabs(prev => prev.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      } else {
        setEnquiries(prev => prev.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        ));
      }
      
      // Recalculate stats
      calculateStats(tickets, cabs, enquiries);
      
      // Close details if open
      setSelectedBooking(null);
      
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return "bg-green-50 text-green-700 border-green-200";
      case 'pending': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'rejected': return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceIcon = (service) => {
    const serviceStr = service?.toLowerCase() || '';
    if (serviceStr.includes('cab') || serviceStr.includes('car')) {
      return <Car className="w-5 h-5" />;
    }
    if (serviceStr.includes('train')) {
      return <Train className="w-5 h-5" />;
    }
    if (serviceStr.includes('flight')) {
      return <Plane className="w-5 h-5" />;
    }
    if (serviceStr.includes('tour') || serviceStr.includes('package')) {
      return <Package className="w-5 h-5" />;
    }
    if (serviceStr.includes('hotel')) {
      return <Hotel className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getServiceColor = (service) => {
    const serviceStr = service?.toLowerCase() || '';
    if (serviceStr.includes('cab') || serviceStr.includes('car')) {
      return "bg-blue-100 text-blue-700";
    }
    if (serviceStr.includes('train')) {
      return "bg-green-100 text-green-700";
    }
    if (serviceStr.includes('flight')) {
      return "bg-purple-100 text-purple-700";
    }
    if (serviceStr.includes('tour') || serviceStr.includes('package')) {
      return "bg-pink-100 text-pink-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  // Get filtered data based on active tab and status filter
  const getFilteredData = () => {
    let data = [];
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === "daily") {
      // Combine all today's bookings
      const allData = [...tickets, ...cabs, ...enquiries];
      data = allData.filter(item => 
        new Date(item.createdAt).toISOString().split('T')[0] === today
      );
    } else if (activeTab === "all") {
      data = [...tickets, ...cabs, ...enquiries];
    } else if (activeTab === "tickets") {
      data = tickets;
      if (statusFilter !== "all") {
        data = data.filter(item => item.status === statusFilter);
      }
    } else if (activeTab === "cabs") {
      data = cabs;
      if (statusFilter !== "all") {
        data = data.filter(item => item.status === statusFilter);
      }
    } else if (activeTab === "enquiries") {
      data = enquiries;
      if (statusFilter !== "all") {
        data = data.filter(item => item.status === statusFilter);
      }
    }
    
    // Apply status filter for daily and all tabs
    if ((activeTab === "daily" || activeTab === "all") && statusFilter !== "all") {
      data = data.filter(item => item.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        (item.name?.toLowerCase().includes(term)) ||
        (item.phone?.includes(term)) ||
        (item.email?.toLowerCase().includes(term)) ||
        (item.service?.toLowerCase().includes(term)) ||
        (item.pickupLocation?.toLowerCase().includes(term)) ||
        (item.from?.toLowerCase().includes(term)) ||
        (item.to?.toLowerCase().includes(term))
      );
    }
    
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the admin dashboard</p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User className="w-5 h-5" />
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Travel Booking Admin</h1>
                    <p className="text-xs text-gray-500">Manage all bookings in one place</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="font-medium text-gray-900">{localStorage.getItem("adminEmail")}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Main Stats Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Dashboard</h2>
              <p className="text-gray-600">Manage and track all booking activities</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Daily Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.daily.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending: {stats.daily.pending}</span>
                  <span className="text-green-600">Confirmed: {stats.daily.confirmed}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.daily.revenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Overall: ₹{stats.overall.revenue.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{quickStats.conversionRate}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm">
                  {quickStats.conversionRate > 70 ? (
                    <><UpTrend className="w-4 h-4 text-green-500" /><span className="text-green-600">Good performance</span></>
                  ) : (
                    <><DownTrend className="w-4 h-4 text-amber-500" /><span className="text-amber-600">Needs improvement</span></>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Service</p>
                  <p className="text-lg font-bold text-gray-900 mt-1 truncate">{quickStats.topService}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Peak hour: {quickStats.peakHour}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Bookings List */}
          <div className="lg:w-2/3">
            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveTab("daily")}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "daily" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      All Bookings
                    </button>
                    <button
                      onClick={() => setActiveTab("tickets")}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "tickets" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      Tickets
                    </button>
                    <button
                      onClick={() => setActiveTab("cabs")}
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "cabs" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      Cabs
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Status Triage */}
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-3">
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${statusFilter === "pending" ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Clock className="w-4 h-4" />
                    Pending ({activeTab === "daily" ? stats.daily.pending : stats.overall.pending})
                  </button>
                  <button
                    onClick={() => setStatusFilter("confirmed")}
                    className={`py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${statusFilter === "confirmed" ? "bg-green-50 text-green-700 border-b-2 border-green-500" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmed ({activeTab === "daily" ? stats.daily.confirmed : stats.overall.confirmed})
                  </button>
                  <button
                    onClick={() => setStatusFilter("rejected")}
                    className={`py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${statusFilter === "rejected" ? "bg-red-50 text-red-700 border-b-2 border-red-500" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <XCircle className="w-4 h-4" />
                    Rejected ({activeTab === "daily" ? stats.daily.rejected : stats.overall.rejected})
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">No {statusFilter} bookings found</p>
                  <p className="text-gray-600">Try changing filters or check back later</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredData.map((item) => (
                    <div 
                      key={item._id} 
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedBooking?._id === item._id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedBooking(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getServiceColor(item.service || item.carType || item.ticketMode)}`}>
                            {getServiceIcon(item.service || item.carType || item.ticketMode)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.status)}`}>
                                {getStatusIcon(item.status)}
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.service || (item.ticketMode ? `${item.ticketMode} Ticket` : 'Cab Booking')}
                              {item.from && item.to && ` • ${item.from} to ${item.to}`}
                              {item.pickupLocation && item.dropLocation && ` • ${item.pickupLocation} to ${item.dropLocation}`}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                {item.phone}
                              </span>
                              {item.email && (
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                  <Mail className="w-3 h-3" />
                                  {item.email}
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {formatTime(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const type = tickets.find(t => t._id === item._id) ? 'ticket' : 
                                              cabs.find(c => c._id === item._id) ? 'cab' : 'enquiry';
                                  updateStatus(type, item._id, 'confirmed');
                                }}
                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const type = tickets.find(t => t._id === item._id) ? 'ticket' : 
                                              cabs.find(c => c._id === item._id) ? 'cab' : 'enquiry';
                                  updateStatus(type, item._id, 'rejected');
                                }}
                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/${item.phone.replace('+', '')}`, '_blank');
                            }}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Details & Quick Actions */}
          <div className="lg:w-1/3">
            {/* Selected Booking Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Booking Details</h3>
                <p className="text-sm text-gray-600">View and manage selected booking</p>
              </div>
              
              {selectedBooking ? (
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${getServiceColor(selectedBooking.service || selectedBooking.carType || selectedBooking.ticketMode)}`}>
                          {getServiceIcon(selectedBooking.service || selectedBooking.carType || selectedBooking.ticketMode)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{selectedBooking.name}</h4>
                          <p className="text-sm text-gray-600">{selectedBooking.service || (selectedBooking.ticketMode ? `${selectedBooking.ticketMode} Ticket` : 'Cab Booking')}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{selectedBooking.phone}</p>
                          <button
                            onClick={() => copyToClipboard(selectedBooking.phone)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-medium truncate">{selectedBooking.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    {(selectedBooking.from && selectedBooking.to) && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Route</p>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{selectedBooking.from}</p>
                            <Navigation className="w-4 h-4 mx-auto my-1 text-gray-400" />
                            <p className="font-medium">{selectedBooking.to}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.pickupLocation && selectedBooking.dropLocation) && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pickup & Drop</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{selectedBooking.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>{selectedBooking.dropLocation}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {selectedBooking.date && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Travel Date</p>
                          <p className="font-medium">{selectedBooking.date}</p>
                        </div>
                      )}
                      {selectedBooking.time && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Travel Time</p>
                          <p className="font-medium">{selectedBooking.time}</p>
                        </div>
                      )}
                    </div>
                    
                    {(selectedBooking.carType || selectedBooking.passengers) && (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedBooking.carType && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Car Type</p>
                            <p className="font-medium">{selectedBooking.carType}</p>
                          </div>
                        )}
                        {selectedBooking.passengers && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Passengers</p>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{selectedBooking.passengers}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedBooking.price && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Price</p>
                        <p className="text-xl font-bold text-green-600">₹{selectedBooking.price}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Booking Time</p>
                      <p className="font-medium">{formatDate(selectedBooking.createdAt)} at {formatTime(selectedBooking.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${selectedBooking.phone.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${selectedBooking.phone}`}
                          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <PhoneCall className="w-5 h-5" />
                          Call
                        </a>
                      </div>
                      
                      {selectedBooking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const type = tickets.find(t => t._id === selectedBooking._id) ? 'ticket' : 
                                          cabs.find(c => c._id === selectedBooking._id) ? 'cab' : 'enquiry';
                              updateStatus(type, selectedBooking._id, 'confirmed');
                            }}
                            className="flex-1 bg-green-50 text-green-700 py-2.5 rounded-lg hover:bg-green-100 transition-colors font-medium"
                          >
                            Accept Booking
                          </button>
                          <button
                            onClick={() => {
                              const type = tickets.find(t => t._id === selectedBooking._id) ? 'ticket' : 
                                          cabs.find(c => c._id === selectedBooking._id) ? 'cab' : 'enquiry';
                              updateStatus(type, selectedBooking._id, 'rejected');
                            }}
                            className="flex-1 bg-red-50 text-red-700 py-2.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            Reject Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Select a booking to view details</p>
                  <p className="text-sm text-gray-500 mt-1">Click on any booking from the list</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                <p className="text-sm text-gray-600">Overview of booking performance</p>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-bold text-gray-900">{stats.overall.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Action</span>
                  <span className="font-bold text-amber-600">{stats.overall.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-bold text-green-600">{stats.overall.confirmed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rejected</span>
                  <span className="font-bold text-red-600">{stats.overall.rejected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overall Revenue</span>
                  <span className="font-bold text-gray-900">₹{stats.overall.revenue.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Today vs Yesterday</span>
                    <span className={`flex items-center gap-1 font-medium ${stats.daily.total > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {stats.daily.total > 0 ? <UpTrend className="w-4 h-4" /> : <DownTrend className="w-4 h-4" />}
                      {stats.daily.total} bookings
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                    <span className="text-xs text-gray-600">Print</span>
                  </button>
                  <button
                    onClick={loadData}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-blue-600">Refresh</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className="p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-xs text-amber-600">Pending</span>
                  </button>
                  <button
                    onClick={() => {
                      const data = [...tickets, ...cabs, ...enquiries];
                      const csv = [
                        ['Name', 'Phone', 'Service', 'Status', 'Date', 'Amount'],
                        ...data.map(item => [
                          item.name,
                          item.phone,
                          item.service || item.carType || 'Enquiry',
                          item.status,
                          formatDate(item.createdAt),
                          item.price || item.estimatedCost || '0'
                        ])
                      ].map(row => row.join(',')).join('\n');
                      
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `all_bookings_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Download className="w-5 h-5 text-green-600" />
                    <span className="text-xs text-green-600">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;