import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route, Link, NavLink } from 'react-router-dom';

const App = () => { 
  return (
    <>
    <nav>
      <NavLink to="/">Anasayfa</NavLink>
      <NavLink to="/login">Giriş Yap</NavLink>
    </nav>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
    </>
  );
}

export default App;
