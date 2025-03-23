import Footer from "./components/Footer";
import "./App.css";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import GetItem from "./components/GetItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions } from "./store/auth";
import OrderHistory from "./components/OrderHistory";
import Settings from "./components/Settings";
import AllOrders from "./components/AllOrders";
import AddItem from "./components/AddItem";
import UpdateItem from "./components/UpdateItem";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, [dispatch]);

  // Role-based Routes
  const renderProfileRoutes = () => {
    if (role === "user") {
      return (
        <>
          <Route index element={<OrderHistory />} />
          <Route path="settings" element={<Settings />} />
        </>
      );
    } else if (role === "admin") {
      return (
        <>
          <Route index element={<AllOrders />} />
          <Route path="additem" element={<AddItem />} />
        </>
      );
    }
    return null; // Fallback for undefined role
  };

  return (
    <div className="font-serif wrapper">
      <Navbar />
      {/* Main Content Area */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}>
            {renderProfileRoutes()}
          </Route>
          <Route path="/item-details/:id" element={<GetItem />} />
          <Route path="/update-item/:id" element={<UpdateItem />} />
        </Routes>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
