import React from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import SiteEdit from "./site_edit";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/site_edit" element={<SiteEdit/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
