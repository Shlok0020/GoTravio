import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Cabs from "./pages/Cabs.jsx";
import Tickets from "./pages/Tickets.jsx";
import Packages from "./pages/Packages.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminPackages from "./pages/AdminPackages.jsx";



const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cabs" element={<Cabs />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
      </Routes>
    </Layout>
  );
};

export default App;
