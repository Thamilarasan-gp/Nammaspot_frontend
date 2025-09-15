import React, { useState } from 'react';
import axios from 'axios';

const Payment = ({ Total = 100 }) => {
  const [book, setBook] = useState({
    name: "user1",
    author: "John Green",
    img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
    price: 250,
  });

  const KEY_ID = "rzp_test_CMsB4Ic9wCgo4O";

  const initPayment = (data) => {
    const options = {
      key: KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: book.name,
      description: "Test Transaction",
      image: book.img,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = "https://nammaspot-backend.onrender.com/api/payment/verify";
          const { data } = await axios.post(verifyUrl, response);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const orderUrl = "https://nammaspot-backend.onrender.com/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: Total + 5 });
      console.log(data);
      initPayment(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='deliboxmain'>
      <div className='delibox'>
        <h2 className='delivery'>Delivery Informations</h2>

        <div className="n">
          <input type='text' className='firstn' required placeholder='First name' />
          <input type='text' className='secondn' required placeholder='Second name' />
        </div>
        <div><input type='text' className='emailadd' required placeholder='Email address' /></div>
        <div><input type='text' className='street' required placeholder='Street' /></div>

        <div className="c">
          <input type='text' className='city' required placeholder='City' />
          <input type='text' className='state' required placeholder='State' />
        </div>
        <div className="z">
          <input type='text' className='zipcode' required placeholder='Zip code' />
          <input type='text' className='country' required placeholder='Country' />
        </div>
        <input type='text' className='phone' required placeholder='Phone' />
      </div>

      <div className="cartto">
        <h2 className='cartton'> Cart Total</h2>
        <div className='subtotal'><p>Subtotal</p>
          <p>₹ {Total}</p>
        </div>
        <div className='deliveryfee'>
          <p>Delivery Fee</p>
          <p>₹ 5</p>
        </div>
        <div className='totaln'>
          <p>₹ Total</p>
          <p>{Total + 5}</p>
        </div>


        <button type='submit' onClick={handlePayment} className='proceed'>Proceed To Payment</button>
      </div>
    </div>
  );
};

export default Payment;
