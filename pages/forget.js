import React from 'react'
import { IoBagCheck } from "react-icons/io5";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
function Forget() {

    const router = useRouter()
    useEffect(() => {
        console.log(router.query)
        if (localStorage.getItem("token")) {
            router.push("/")
        }
    }, [])

    const [password, setpassword] = useState('')
    const [cpassword, setcpassword] = useState('')
    const [email, setemail] = useState('')
    const sendMail = async () => {
        if (password === cpassword) {


            let data = {
                password,
                sendMail: false
            }
            const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res = await a.json();
            if (res.success) {

            }
        }

    }

    const handleChange = async (e) => {
        if (e.target.name == 'password') {
          setpassword(e.target.value)
        }
        else if (e.target.name == 'cpassword') {
          setcpassword(e.target.value)
        }
        else if (e.target.name == 'email') {
          setemail(e.target.value)
        }
    }

    const resetPassword = async () => {
        if (password === cpassword) {


            let data = {
                password,
                sendMail: false
            }
            const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res = await a.json();
            if (res.success) {
                console.log("password Changed")
            }
            else{
                console.log("error")
            }
        }

    }

    return (
        <div>
            <section className="bg-gray-50 min-h-full">
                <div className="flex flex-col items-center justify-end md:justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="/index" className="flex items-center my-6 mb-32 md:mb-0 md:top-0 relative top-20 text-3xl leading- font-semibold text-blue-900 dark:text-blue">
                        <IoBagCheck className='m-1 text-blue-800' />
                        Yourcart
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                                Forget your password
                            </h1>
                            {router.query.token && <div>
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">New Password</label>
                                        <input value={password} onChange={handleChange} type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required="" />
                                    </div>
                                    <div>
                                        <label for="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm New Password</label>
                                        <input value={cpassword} onChange={handleChange} type="cpassword" name="cpassword" id="cpassword" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required="" />
                                    </div>
                                    {password != cpassword && <span className='text-red-700'>Passwords does not match</span>}
                                    {password == cpassword && password.length > 2 && <span className='text-green-700'>Passwords Match</span>}
                                    <button onClick={resetPassword} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-blue-300 dark:focus:ring-primary-800">Reset Password</button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-900">
                                        Remember Your Password? <Link href={'/login'} className="font-medium text-primary-600 hover:underline dark:text-blue-800">login</Link>
                                    </p>
                                   
                                </div>
                            </div>
                            }
                            {!router.query.token && <div className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
                                    <input value={email} onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-500 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required="" />
                                </div>
                                <button onClick={sendMail} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">Continue</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-900">
                                    Remember Your Password? <Link href={'/login'} className="font-medium text-primary-600 hover:underline dark:text-blue-800">login</Link>
                                </p>
                            </div>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}


export default Forget
