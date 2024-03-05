import React from 'react'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Myaccount() {

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [Pincode, setPincode] = useState('')
  const [address, setaddress] = useState('')
  const [password, setpassword] = useState('')
  const [cpassword, setcpassword] = useState('')
  const [npassword, setnpassword] = useState('')
  const [disabled, setdisabled] = useState(true)
  const [myuser, setmyuser] = useState({ value: null })

  const router = useRouter()
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem("myuser"))
    if (!myuser) {
      router.push("/")
    }
    if (myuser && myuser.token) {
      setmyuser(myuser)
      setemail(myuser.email)
      fetcData(myuser.token)
    }

  }, [])

  const handlemyuserSumbit = async () => {
    let data = { token: myuser.token, address, name, phone, Pincode }
    const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await result.json();
    toast.success("Updated Successfully", {
      position: "top-left",
      autoClose: 2000,
    });
  }
  const handlePasswordSumbit = async () => {
    let res;
    if (npassword == cpassword) {
      let data = { token: myuser.token, password, npassword, cpassword}
      const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

       res = await result.json();
    }
    else{
      res = {success: false}
    }
      if (res.success) {
        toast.success("Password Updated Successfully", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    else {
      toast.error("Password not match! Please Enter both password same", {
        position: "top-left",
        autoClose: 2000,
      });
    }
    setpassword('')
    setnpassword('')
    setcpassword('')

  }
  const fetcData = async (token) => {
    let data = { token: token }
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
    else if (e.target.name == 'address') {
      setaddress(e.target.value)
    }
    else if (e.target.name == 'password') {
      setpassword(e.target.value)
    }
    else if (e.target.name == 'cpassword') {
      setcpassword(e.target.value)
    }
    else if (e.target.name == 'npassword') {
      setnpassword(e.target.value)
    }
    else if (e.target.name == 'Pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
        const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
        const data = await pins.json()
        // if (Object.keys(data).includes(e.target.value)) {
        //   setcity(data[e.target.value][0])
        //   setstate(data[e.target.value][1])
        // }

      }

    }

  }

  return (
    <div className='container mx-auto my-10'>
      <h1 className='font-bold text-3xl text-center my-8'>Update Your Account</h1>
      <ToastContainer />
      <h2 className='w-6/12 md:w-5/12 my-8 font-bold pl-10 md:pl-0 text-center'>1. Delivery Details</h2>
      <div className="items-center justify-center  flex">
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" onChange={handleChange} value={name} id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email (cannot be Updated)</label>
            {myuser && myuser.token ? <input type="email" value={myuser.email} id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" readOnly /> : <input type="email" onChange={handleChange} value={email} id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
      <div className="px-2 justify-center flex w-full">
        <div className="mb-4 w-2/3 ">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" onChange={handleChange} value={address} name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-3 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
        </div>

      </div>
      <div className="items-center justify-center  flex">
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input type="text" onChange={handleChange} value={phone} id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/3">
          <div className="mb-4">
            <label htmlFor="Pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" onChange={handleChange} value={Pincode} id="Pincode" name="Pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <div className="my-4 mb-9 w-5/6 md:w-3/12 md:ml-28 ml-7 flex justify-center ">
        <button onClick={handlemyuserSumbit} className="flex text-white bg-pink-500 disabled:bg-pink-300 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded font-bold text-sm">Update</button>
      </div>
      <h2 className='w-6/12 md:w-5/12 my-8 font-bold pl-10 md:pl-0 text-center'>2. Change Password</h2>
      <div className="items-center justify-center  flex">
        <div className="px-2 mx-7 w-1/5">
          <div className="mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
            <input type="password" onChange={handleChange} value={password} id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 mx-7 w-1/5">
          <div className="mb-4">
            <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">New Password</label>
            <input type="password" onChange={handleChange} value={npassword} id="npassword" name="npassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />

          </div>
        </div>
        <div className="px-2 mx-7 w-1/5">
          <div className="mb-4">
            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
            <input type="password" onChange={handleChange} value={cpassword} id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-2 transition-colors duration-200 ease-in-out" />

          </div>
        </div>
      </div>
      <div className="my-4 mb-9 w-5/6 md:w-3/12 md:ml-28 ml-7 flex justify-center ">
        <button onClick={handlePasswordSumbit} className="flex text-white bg-pink-500 disabled:bg-pink-300 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded font-bold text-sm">Update</button>
      </div>

    </div>
  )
}

export default Myaccount