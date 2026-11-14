import { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Content from "./Pages/Content";
import Dashboard from "./Pages/Dashboard";
import Income from "./Pages/Income";

export const navContext = createContext();

function App() {
  const [navstate, setNavstate] = useState(true);
  const [toaststate, setToaststate] = useState(false);
  const [utente, setUtente] = useState("");
  const [login, setLogin] = useState(false);

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F6F8FB]">
      <navContext.Provider
        value={{
          navstate,
          setNavstate,
          toaststate,
          setToaststate,
          utente,
          setUtente,
          login,
          setLogin,
        }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Content />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Income />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </navContext.Provider>
    </div>
  );
}

export default App;
