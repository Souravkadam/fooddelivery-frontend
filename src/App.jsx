import React, { useContext } from 'react';
import Menubar from './components/Menubar/Menubar';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import Contact from './pages/Contact/Contact';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MyOrders from './pages/MyOrders/MyOrders';
import { StoreContext } from './context/StoreContext';

const App = () => {
  const { token } = useContext(StoreContext);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Menubar />
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="flex-grow-1">
        <Routes>
          <Route path='/'          element={<Home />} />
          <Route path='/contact'   element={<Contact />} />
          <Route path='/explore'   element={<ExploreFood />} />
          <Route path='/food/:id'  element={<FoodDetails />} />
          <Route path='/cart'      element={<Cart />} />
          <Route path='/order'     element={token ? <PlaceOrder /> : <Login />} />
          <Route path='/register'  element={token ? <Home /> : <Register />} />
          <Route path='/login'     element={token ? <Home /> : <Login />} />
          <Route path='/myorders'  element={token ? <MyOrders /> : <Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
