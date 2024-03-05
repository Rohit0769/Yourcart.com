import React, { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import mongoose from 'mongoose'
import Order from '@/models/Order'
import Link from 'next/link'
function Orders({ clearCart, order }) {
  // let products = order.products;

  const router = useRouter()

  let products = order.products

  useEffect(() => {

    if (router.query.clearCart == 1) {
      clearCart()
    }

  }, [])

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">Codesware.com</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-2">Order Id: #{order.orderId}</h1>
              <p className="leading-relaxed mb-1">Yah! Your Order has successfully Placed! 
              </p>
              <p className="leading-relaxed mb-5"> 
                Your Payment Status is: <b>{order.status}</b>
                </p>
              <div className="flex mb-4">
                <a className="flex-grow text-pink-500 border-pink-500 py-2 text-lg  px-1">Item Description</a>
                <a className="flex-grow border-gray-300  py-2  text-lg px-32">Quantity</a>
                <a className="flex-grow border-gray-300 py-2  text-lg px-1">Item Total</a>
              </div>
              {Object.keys(products).map((item)=>{
                return <div key={item} className="flex border-t border-gray-200 py-2">
                <span className="text-gray-500">{products[item].name}({products[item].size}/{products[item].variant})</span>
                <div className="text-gray-500 ml-auto">{products[item].qty}</div>
                <span className="ml-auto text-gray-900">₹{products[item].price} X {products[item].qty} = ₹{products[item].price * products[item].qty}</span>
              </div>})}

              <div className="flex flex-col my-10">
                <span className="title-font font-medium text-2xl text-gray-900">SubTotal: ₹{order.amount}.00</span>
                <div>

                 <Link href={'/userorders'}>
                 <button className="flex my-8 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button></Link> 
                </div>
              </div>
            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/y/n/h/m-mor-pankh-sti-original-imagmjdy4jwkhgwd.jpeg?q=70&crop=false" />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let order = await Order.findById(context.query.id);

  return {
    props: { order: JSON.parse(JSON.stringify(order)) },
  };

  // Rest of the code...
}

export default Orders