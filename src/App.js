import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./USER1/Login/Login";
import Fpage from "./Fpage/Fpage";
import Home from "./USER1/Home/Home";
import Book from "./Book/Book";
import AdminMap from "./Map";
import Map from "./Admin_map";
import TicketBooking from "./USER1/Home/TicketBooking";
import Ad_login from "./ADMIN1/Admin_login/Ad_login";
import Ad_reg from "./ADMIN1/Admin_reg/Ad_reg";
import AdminHome from "./ADMIN1/Admin_home/AdminHome";
import SalesTable from "./Admin/Sales/SalesTable";
import WalletPage from "./Admin/Sales/Wallet/WalletPage";
import ProfilePage from "./Profile/ProfilePage";
import NotificationsPage from "./Admin/Notification/Notifications";
import Payment from "./payment/Payment";
import ParkingBooking from "./USER1/Booking/Ubook ";
import ConfirmationPage from "./USER1/Booking/Book confirm/Confirm";
import Pay from "./Pay";
import Pingenerate from "./USER1/Booking/Book confirm/Pingenerate";
import Verify from "./ADMIN1/Admin_home/Verify/Verify";
import Mybooking from "./USER1/Mybooking/Mybooking";
import Register from "./USER1/Register/Register";
import VerifyOTP from "./USER1/Register/VerifyOTP";
import Usernotification from "./USER1/Booking/Noti/Usernotification";
import HomePage1 from "./USER1/Homepage/App";
import Routemap from "./USER1/Routemap";
import { LanguageProvider } from './USER1/Homepage/LanguageContext'
import { QueryClient, QueryClientProvider } from 'react-query';
import Review from './USER1/Review'
import AProfilePage from "./Profile/AProfile";
import Myslots from "./ADMIN1/Admin_home/Myslots";
import ParkingLot from "./ParkingLot";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <div>
      <BrowserRouter>
        <Routes>
           <Route path="/verifyOTP" component={VerifyOTP} />
          <Route exact path="/not" element={<Fpage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Adminmap" element={<AdminMap/>}></Route>
          <Route path="/" element={<HomePage1/>}></Route> 
          <Route path="/map" element={<Map/>}></Route>
         <Route path="/book" element={<Book />}></Route>
         <Route path="/alogin" element={<Ad_login/>}></Route>
         <Route path="/areg" element={<Ad_reg/>}></Route>
         <Route path="/Adminhome" element={<AdminHome/>}></Route>
         <Route path="/sales" element={<SalesTable/>}></Route>
         <Route path="/profile" element={<ProfilePage/>}></Route>
         <Route path="/wallet" element={<WalletPage />}></Route>
         <Route path="/notification" element={<NotificationsPage/>}></Route>
         <Route path="/notification2" element={<Usernotification/>}></Route>
         <Route path="/ticketbook" element={<TicketBooking />}></Route>
         <Route path="/payment" element={<Payment />}></Route>
         <Route path="/booking" element={<ParkingBooking />}></Route>
         <Route path="/confirmbooking" element={<ConfirmationPage />}></Route>
         <Route path="/hello" element={<Pay/>}></Route> 
         <Route path="/pin" element={<Pingenerate/>}></Route>
         <Route path="/verify" element={<Verify/>}></Route>
         <Route path="/mybooking" element={<Mybooking/>}></Route>
         <Route path="routemap" element={<Routemap/>}></Route>
         <Route path="/review" element={<Review/>}></Route> 
 
         <Route path="/aprofile" element={<AProfilePage/>}></Route> 
<Route path="/parkinglot" element={<ParkingLot/>}></Route> 
         <Route path="/myslots" element={<Myslots/>}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
      </LanguageProvider>
             </QueryClientProvider>
  );
}

export default App;


/*
ute exact path="/" element={<Fpage />}></Route>
          <Route path="/Register" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Home" element={<Home />}></Route>



import React from "react";
import Signup from "./USER1/Register/Register";
import { AuthProvider } from './AuthContext';

import ProtectedRoute from './ProtectedRoute';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./USER1/Login/Login";
import Fpage from "./Fpage/Fpage";
import Home from "./USER1/Home/Home";
import Book from "./Book/Book";
import AdminMap from "./Map";
import Map from "./Admin_map";
import TicketBooking from "./USER1/Home/TicketBooking";
import Ad_login from "./ADMIN1/Admin_login/Ad_login";
import Ad_reg from "./ADMIN1/Admin_reg/Ad_reg";
import AdminHome from "./ADMIN1/Admin_home/AdminHome";
import SalesTable from "./Admin/Sales/SalesTable";
import WalletPage from "./Admin/Sales/Wallet/WalletPage";
import ProfilePage from "./Profile/ProfilePage";
import NotificationsPage from "./Admin/Notification/Notifications";
import Payment from "./payment/Payment";
import ParkingBooking from "./USER1/Booking/Ubook ";
import ConfirmationPage from "./USER1/Booking/Book confirm/Confirm";
import Pay from "./Pay";
import Pingenerate from "./USER1/Booking/Book confirm/Pingenerate";
import Verify from "./ADMIN1/Admin_home/Verify/Verify";
import Mybooking from "./USER1/Mybooking/Mybooking";
import Register from "./USER1/Register/Register";
import VerifyOTP from "./USER1/Register/VerifyOTP";
import Usernotification from "./USER1/Booking/Noti/Usernotification";
import HomePage1 from "./USER1/Homepage/App";


function App() {
  return (
<>
 <AuthProvider>
     <BrowserRouter>

     <Routes>
          <Route path="/not" element={<Fpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<HomePage1 />} />
          <Route path="/map" element={<Map/>}/>
          <Route path="/Adminmap" element={<ProtectedRoute element={AdminMap} />} />
         
          <Route path="/book" element={<ProtectedRoute element={Book} />} />
          <Route path="/alogin" element={<ProtectedRoute element={Ad_login} />} />
          <Route path="/areg" element={<ProtectedRoute element={Ad_reg} />} />
          <Route path="/Adminhome" element={<ProtectedRoute element={AdminHome} />} />
          <Route path="/sales" element={<ProtectedRoute element={SalesTable} />} />
          <Route path="/profile" element={<ProtectedRoute element={ProfilePage} />} />
          <Route path="/wallet" element={<ProtectedRoute element={WalletPage} />} />
          <Route path="/notification" element={<ProtectedRoute element={NotificationsPage} />} />
          <Route path="/notification2" element={<ProtectedRoute element={Usernotification} />} />
          <Route path="/ticketbook" element={<ProtectedRoute element={TicketBooking} />} />
          <Route path="/payment" element={<ProtectedRoute element={Payment} />} />
          <Route path="/booking" element={<ProtectedRoute element={ParkingBooking} />} />
          <Route path="/confirmbooking" element={<ProtectedRoute element={ConfirmationPage} />} />
          <Route path="/hello" element={<ProtectedRoute element={Pay} />} />
          <Route path="/pin" element={<ProtectedRoute element={Pingenerate} />} />
          <Route path="/verify" element={<ProtectedRoute element={Verify} />} />
          <Route path="/mybooking" element={<ProtectedRoute element={Mybooking} />} />
        </Routes>
       </BrowserRouter>
    

     </AuthProvider>
      </>
  );
}

export default App;


/*

 <Route path="/map" element={<ProtectedRoute element={Map} />} />
 
ute exact path="/" element={<Fpage />}></Route>
          <Route path="/Register" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Home" element={<Home />}></Route>
*/