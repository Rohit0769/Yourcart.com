import React, { useState, useEffect } from 'react'
import { IoBagCheck } from "react-icons/io5";
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useRouter } from 'next/router';
var jwt = require('jsonwebtoken');



function login() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()
    const handleChange = (e) => {
    
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    }

    useEffect(() => {
      if (localStorage.getItem("myuser")) {
        router.push("/")
      }
    }, [])
    
    const handleSumbit = async (e) => {
        e.preventDefault();

        const data = {email, password };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            // Assuming setName, setEmail, and setPassword are state-setting functions
            setEmail('');
            setPassword('');
            if (result.success) {
                localStorage.setItem("myuser" , JSON.stringify({token :result.token, email: result.email}))
                toast.success("You Login in your Account!", {
                    position: "top-left",
                    autoClose: 2000,
                });  
                setTimeout(() => {
                   router.push("/") 
                }, 1000);
            }
            else{
                toast.error("Invalid Details", {
                    position: "top-left",
                   autoClose: 2000,
                }); 
            }
          
        } catch (error) {
            console.error("Error:", error);
          
        }
    };
    return (
        <div>
            <section className="bg-gray-50">
            <ToastContainer />
                <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
                    <a href="/index" className="flex items-center my-10 text-3xl mb-32 md:mb-0 md:top-0 relative top-24 font-semibold text-blue-900 dark:text-blue">
                        <IoBagCheck className='m-1 text-blue-800' />
                        Yourcart
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                                login in to your account
                            </h1>
                            <form onSubmit={handleSumbit} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
                                    <input onChange={handleChange} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required="" />
                                </div>
                                <div>
                                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                                    <input onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label for="remember" className="text-black dark:text-black">Remember me</label>
                                        </div>
                                    </div>
                                    <Link href={'/forget'} className="text-sm font-medium text-primary-600 hover:underline dark:text-blue-700">Forgot password?</Link>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">login</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-900">
                                    Don’t have an account yet? <Link href={'/signup'} className="font-medium text-primary-600 hover:underline dark:text-blue-800">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default login