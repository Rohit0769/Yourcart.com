import React, { useState } from 'react'
import mongoose from 'mongoose';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
function userOrders() {

    const router = useRouter()
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myuser')).token }),
            });

            const res = await a.json();
            console.log(res)
            setProducts(res.orders)
            
        }

        // if (!localStorage.getItem("myuser")) {
        //     router.push("/")
        // }
        
            fetchOrders();
        
            console.log(products)

    }, [])
    
    return (
        <div>
            <div className="my-5 mx-auto min-h-screen w-5/6">
                <h1 className='text-2xl mb-7 text-center px-1 mx-auto font-bold'>Your Orders</h1>

                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">#OrderId</th>
                                            <th scope="col" className="px-6 py-4">Email-Id</th>
                                            <th scope="col" className="px-6 py-4">Amount</th>
                                            <th scope="col" className="px-6 py-4">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(products) && products.length > 0 ? (
                                            products.map((item) => (
                                                <tr key={item._id} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{item.orderId}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{item.amount}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <Link href={'/order?id=' + item._id}>Details</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className='text-center text-2xl font-bold'>
                                                <td colSpan="4">No orders available</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default userOrders