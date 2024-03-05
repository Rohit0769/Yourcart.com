import React from 'react'
import Link from 'next/link';
import { PiShoppingCart } from "react-icons/pi";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoBagCheck } from "react-icons/io5";
import Head from 'next/head';
import Script from 'next/script';
import { NEXT_BODY_SUFFIX } from 'next/dist/lib/constants';
import { useEffect, useState } from 'react';
import Product from '@/models/Product';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Checkout({ cart, clearCart, subtotal, addtoCart, removefromCart }) {

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [Pincode, setPincode] = useState('')
  const [address, setaddress] = useState('')
  const [city, setcity] = useState('')
  const [state, setstate] = useState('')
  const [disabled, setdisabled] = useState(true)
  const [user, setuser] = useState({value:null})

  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem("myuser"))
   if (myuser && myuser.token) {
    setuser(myuser)
    setemail(myuser.email)
    fetcData(myuser.token)
   }
  }, [])
  
  const fetcData = async (token) => {
    let data = { token: token }
    console.log(data)
    const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await result.json();
    setname(res.name)
    setaddress(res.address)
    setPincode(res.Pincode)
    setphone(res.phone)
    getPincode(res.Pincode)
  }

  const getPincode = async (pin)=>{
    const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    const data = await pins.json()
    if (Object.keys(data).includes(pin)) {
        setcity(data[pin][0])
        setstate(data[pin][1])
    }
  
  
  else{
    setcity('')
    setstate('')
  }

}
  

  const handleChange = async (e) => {
    if (e.target.name == 'name') {
      setname(e.target.value)
    }
    else if (e.target.name == 'phone') {
      setphone(e.target.value)
    }
    else if (e.target.name == 'email') {
      setemail(e.target.value)
    }
    else if (e.target.name == 'Pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
       getPincode(pin)
      }
      

    }

    else if (e.target.name == 'address') {
      setaddress(e.target.value)
    }

    if (name.length > 3 && email.length > 3 && address.length > 3 && Pincode.length > 3) {
      setdisabled(false)
    }
    else {
      setdisabled(true)
    }
  }

  const intiatepayment = async () => {
  
      let oid = Math.floor(Math.random() * Date.now());
      const data = { cart, subtotal, oid, email: email, name, address, phone, Pincode};

      const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const Txnres = await result.json();
      
      if (Txnres.success) {
        
    
      let txnToken = Txnres.txnToken

      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid,
          "token": txnToken,
          "tokenType": "TXN_TOKEN",
          "amount": subtotal
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      
      };

      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        // After successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
      
      }).catch(function onError(error) {
        console.log("Error => ", error);
      });
    }
    else{
      if (Txnres.ClearCart) {
        clearCart()
        
      }
      toast.error(Txnres.error, {
        position: "top-left",
       autoClose: 2000,
    });

    }

    } 


  return (
    <div className='container m-auto'>
      <Head>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script type="application/javascript" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} crossorigin="anonymous" />
      <h1 className='font-bold text-3xl text-center leading-tight relative top-10 my-20'>Checkout</h1>
      <ToastContainer />
      <h2 className='w-6/12 md:w-5/12 my-8 font-bold pl-10 md:pl-0 text-center'>1. Delivery Details</h2>
      <div className="items-center justify-center  flex">
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" placeholder='Enter Your Name' onChange={handleChange} value={name} id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {user && user.token? <input type="email" value={user.email} id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" readOnly /> : <input type="email" onChange={handleChange} value={email} id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />}
            
          </div>
        </div>
      </div>
      <div className="px-2 justify-center flex w-full">
        <div className="mb-4 w-2/3 ">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" placeholder='Enter Your Address' onChange={handleChange} value={address} name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-3 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          Phone
          City
          State
          Pincode
        </div>

      </div>
      <div className="items-center justify-center  flex">
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input type="text" onChange={handleChange} value={phone} id="phone" name="phone" placeholder="Enter Your 10 Digit Phone Number" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="Pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" placeholder='Enter Your Pincode' onChange={handleChange} value={Pincode} id="Pincode" name="Pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
      </div>

      <div className="items-center justify-center  flex">
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="state" onChange={handleChange} className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" placeholder='State' value={state} id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" readOnly/>
          </div>
        </div>
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" placeholder='City' onChange={handleChange} value={city} id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" readOnly/>
          </div>
        </div>
      </div>
      <h2 className='w-6/12 md:w-5/12 my-8 font-bold pl-10 md:pl-0 md:pr-6 text-center'>2. Review Your Cart Items</h2>
      <div className="flex justify-center">
        <div className="sidebar z-10 px-8 bg-blue-100 w-3/4 p-10">
          <ol className='list-decimal font-semibold'>
            {Object.keys(cart).length == 0 && <div className='my-6 text-lg'>Your Cart is Empty!</div>}
            {Object.keys(cart).map((k) => {
              return <li key={k}>
                <div className="item flex my-5">
                  <div className='w-1/4 font-semibold'>{cart[k].name} {cart[k].size}/{cart[k].variant}</div>
                  <div className='w-3/4 md:w-1/6 flex items-center justify-center font-semibol cursor-pointer text-lg'><AiFillMinusCircle onClick={() => { removefromCart(k, 1, cart[k].price, cart[k].name, cart[k].variant, cart[k].size) }} className='text-sm text-blue-500' /> <span className='mx-2'>{cart[k].qty}</span><FaCirclePlus onClick={() => { addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].variant, cart[k].size) }} className='text-sm text-blue-500' /></div>
                </div>
              </li>
            })}

          </ol>
          <span className='font-bold w-1/2 text-center'>Subtotal: ₹{subtotal}</span>
        </div>
      </div>
      <div className="flex">
        <div className="my-4 w-5/6 md:w-3/12 md:ml-14 ml-7 flex justify-center ">
          <Link href={" "}><button disabled={disabled} onClick={intiatepayment} className="flex text-white bg-blue-500 disabled:bg-blue-300 border-0 py-2 px-3 focus:outline-none hover:bg-blue-600 rounded font-bold text-sm"><IoBagCheck className='m-1' />Pay: ₹{subtotal}</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Checkout