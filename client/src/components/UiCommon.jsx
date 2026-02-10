import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Clock, Star, Users, MapPin, Calendar } from "lucide-react";

export const SectionHeader = ({ title, subtitle, action, to, badge }) => (
  <div className="relative mb-8">
    {badge && (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4 animate-fade-in">
        <Sparkles size={16} className="text-yellow-500" />
        <span className="font-medium text-blue-700 text-sm">{badge}</span>
      </div>
    )}
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
          {title}
          <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 bg-clip-text text-transparent">
            {title.includes(' ') ? title.split(' ').pop() : ''}
          </span>
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && to && (
        <Link
          to={to}
          className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base transition-all hover:gap-3"
        >
          {action}
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </Link>
      )}
    </div>
  </div>
);

export const FeatureCard = ({ title, description, icon, delay = 0 }) => (
  <div 
    className="group relative"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const PackageCard = ({ pkg }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    {/* Image Container */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={pkg.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"}
        alt={pkg.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      
      {/* Badge */}
      {pkg.tag && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {pkg.tag}
        </span>
      )}
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    {/* Content */}
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MapPin size={14} />
            <span>{pkg.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold">4.8</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span>{pkg.days} days</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{pkg.priceFrom}
          </p>
        </div>
      </div>

      {/* Highlights */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Highlights:</p>
          <ul className="space-y-1">
            {pkg.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <a
        href={`https://wa.me/919023884833?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(pkg.title)}%20package`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all hover:shadow-lg"
      >
        <span className="flex items-center justify-center gap-2">
          <span className="text-base">💬</span>
          Enquire on WhatsApp
        </span>
      </a>
    </div>
  </div>
);

// New Component: Stats Card
export const StatsCard = ({ value, label, icon, color = "blue" }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </div>
);

// New Component: Info Card
export const InfoCard = ({ type = "info", title, description, action }) => {
  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };

  const bgColors = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-yellow-50 border-yellow-200",
    error: "bg-red-50 border-red-200"
  };

  return (
    <div className={`rounded-2xl border p-5 ${bgColors[type]} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>}
          <p className="text-gray-700 text-sm">{description}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};

// Animation CSS
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}