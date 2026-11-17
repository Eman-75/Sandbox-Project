// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// // Landing & Auth
// import Landing from "./components/pages/Landing/Landing";
// import Login from "./components/pages/Auth/Login";
// import Signup from "./components/pages/Auth/Signup";
// import VerifyEmail from "./components/pages/Auth/VerifyEmail";
// import React, { useEffect } from "react";

// // Dashboard Routes
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return (
//     <BrowserRouter>
//       <Toaster position="top-right" containerStyle={{
//         zIndex: 99999, 
//       }} />
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/verify-email" element={<VerifyEmail />} />
//         <Route path="/*" element={<AppRoutes />} />
//       </Routes>
//       {/* --- GLOBAL FLOATING WIDGET --- */}
//       <div className="gtranslate_wrapper fixed bottom-6 right-6 z-[9999]"></div>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React from "react";

// Landing pages
import PublicLayout from "./components/pages/Landing/PublicLayout";
import Home from "./components/pages/Landing/Home";
import About from "./components/pages/Landing/About";
import Services from "./components/pages/Landing/Services";
import Contact from "./components/pages/Landing/Contact";

// Auth
import Login from "./components/pages/Auth/Login";
import Signup from "./components/pages/Auth/Signup";
import VerifyEmail from "./components/pages/Auth/VerifyEmail";

// Dashboard Routes
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <Routes>
        {/* Public landing pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/who-we-serve" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Dashboards */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>

      {/* --- GLOBAL FLOATING WIDGET --- */}
      <div className="gtranslate_wrapper fixed bottom-6 right-6 z-[9999]"></div>
    </BrowserRouter>
  );
}

export default App;