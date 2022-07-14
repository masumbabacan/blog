import Login from "./pages/Login";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import UsersAll from "./pages/UsersAll";

const App = () => { 
  return (
    <>
    <nav>
      <NavLink to="/">Anasayfa</NavLink>
      <NavLink to="/login">Giriş Yap</NavLink>
      <NavLink to="/userall">Tüm kullanıcılar</NavLink>
    </nav>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/userall" element={<UsersAll />}/>
      <Route path="*" element={<Page404 />}/>
    </Routes>
    </>
  );
}

export default App;
