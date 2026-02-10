import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API, getAdminHeaders } from "../api";
import { SectionHeader, PackageCard, InfoCard } from "../components/uiCommon";
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  RefreshCw,
  Search,
  Filter,
  Image,
  Tag,
  Calendar,
  IndianRupee,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Shield
} from "lucide-react";

const AdminPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    days: "",
    priceFrom: "",
    tag: "",
    imageUrl: "",
    highlightsText: "",
  });

  const isAuthed = !!localStorage.getItem("adminToken");

  // Load packages on mount
  useEffect(() => {
    if (!isAuthed) return;
    loadPackages();
  }, [isAuthed]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setStatus({ type: "loading", message: "Loading packages..." });
      
      const res = await API.get("/packages");
      setPackages(res.data || []);
      
      setStatus({ type: "success", message: `Loaded ${res.data?.length || 0} packages` });
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
      
    } catch (err) {
      console.error("Error loading packages:", err);
      setStatus({ 
        type: "error", 
        message: "Error loading packages. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({
      title: "",
      location: "",
      days: "",
      priceFrom: "",
      tag: "",
      imageUrl: "",
      highlightsText: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "loading", message: isEditing ? "Updating package..." : "Adding package..." });

    try {
      const payload = {
        title: form.title,
        location: form.location,
        days: Number(form.days) || 0,
        priceFrom: Number(form.priceFrom) || 0,
        tag: form.tag,
        imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        highlights: form.highlightsText
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
      };

      if (isEditing && editId) {
        // Update existing package
        await API.put(`/packages/${editId}`, payload, getAdminHeaders());
        setStatus({ type: "success", message: "Package updated successfully!" });
      } else {
        // Add new package
        await API.post("/packages", payload, getAdminHeaders());
        setStatus({ type: "success", message: "Package added successfully!" });
      }

      resetForm();
      await loadPackages();
      
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
      
    } catch (err) {
      console.error("Error saving package:", err);
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Error saving package. Please check your credentials." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    
    setLoading(true);
    setStatus({ type: "loading", message: "Deleting package..." });

    try {
      await API.delete(`/packages/${id}`, getAdminHeaders());
      setStatus({ type: "success", message: "Package deleted successfully!" });
      setPackages((prev) => prev.filter((p) => p._id !== id));
      
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
      
    } catch (err) {
      console.error("Error deleting package:", err);
      setStatus({ 
        type: "error", 
        message: "Error deleting package. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setEditId(pkg._id);
    setForm({
      title: pkg.title,
      location: pkg.location,
      days: pkg.days.toString(),
      priceFrom: pkg.priceFrom.toString(),
      tag: pkg.tag || "",
      imageUrl: pkg.imageUrl || "",
      highlightsText: (pkg.highlights || []).join("\n"),
    });
    
    // Scroll to form
    document.getElementById("package-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.tag && pkg.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthed) {
    return (
      <div className="max-w-md mx-auto">
        <InfoCard
          type="warning"
          title="Authentication Required"
          description="Please login to manage travel packages."
          action={
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Shield size={16} />
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <SectionHeader
            title="Manage Trip Packages"
            subtitle="Add, update, and remove travel packages shown on the website."
            badge="Admin Panel"
          />
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Package size={14} />
              <span>{packages.length} packages</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} />
              <span>Live on website</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPackages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              localStorage.removeItem("adminEmail");
              navigate("/admin/login");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Package Management</p>
              <p className="text-sm text-gray-600">
                Logged in as <span className="font-semibold">{localStorage.getItem("adminEmail")}</span>
              </p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-600">Last updated</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status.message && (
        <InfoCard
          type={status.type}
          description={status.message}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section - 1 Column */}
        <div className="lg:col-span-1">
          <div id="package-form" className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {isEditing ? <Edit className="text-blue-600" size={20} /> : <Plus className="text-blue-600" size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {isEditing ? "Edit Package" : "Add New Package"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isEditing ? "Update package details" : "Create new travel package"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Package Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Uttarakhand Hills & Kainchi Dham"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <div className="relative">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Nainital • Kainchi Dham • Ranikhet"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Days & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Days / Nights *
                  </label>
                  <div className="relative">
                    <input
                      name="days"
                      type="number"
                      min="1"
                      value={form.days}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="5"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Starting Price (₹) *
                  </label>
                  <div className="relative">
                    <input
                      name="priceFrom"
                      type="number"
                      min="0"
                      value={form.priceFrom}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="18999"
                      required
                    />
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              {/* Tag & Image */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tag (Optional)
                  </label>
                  <div className="relative">
                    <input
                      name="tag"
                      value={form.tag}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Most booked / Winter special"
                    />
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL (Optional)
                  </label>
                  <div className="relative">
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="https://images.pexels.com/..."
                    />
                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Highlights (one per line)
                </label>
                <textarea
                  name="highlightsText"
                  value={form.highlightsText}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Day 1: Arrival & local sightseeing\nDay 2: Temple visit & lake tour\nDay 3: Mountain trekking"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      {isEditing ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isEditing ? "Update Package" : "Add Package"}
                    </span>
                  )}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Packages List - 2 Columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Package className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Current Packages</h3>
                    <p className="text-sm text-gray-600">{filteredPackages.length} packages found</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loading && packages.length === 0 ? (
                <div className="py-12 text-center">
                  <Loader2 className="inline-block animate-spin text-blue-600 mb-3" size={32} />
                  <p className="text-gray-600">Loading packages...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <AlertCircle className="inline-block mb-3" size={32} />
                  <p className="font-medium">No packages found</p>
                  <p className="text-sm mt-1">Try adding a new package or adjust your search</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div key={pkg._id} className="relative group">
                      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <PackageCard pkg={pkg} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Footer */}
            <div className="border-t border-gray-200 p-5 bg-gray-50 rounded-b-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Eye size={16} />
                    <span>Visible on website</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={16} />
                    <span>Active: {packages.length}</span>
                  </div>
                </div>
                <div className="text-gray-500">
                  Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;