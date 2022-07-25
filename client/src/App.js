import Login from "./pages/Login";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import UsersAll from "./pages/UsersAll";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => { 
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/blog/:id" element={<Page404 />}/>
      <Route path="/userall" element={<UsersAll />}/>
      <Route path="*" element={<Page404 />}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
