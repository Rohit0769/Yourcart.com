import React from 'react'
import Link from 'next/link'
import Product from '@/models/Product'
import mongoose from 'mongoose'
function Pants({ products }) {
  return (
    <div>
      <div>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">

            <div className="flex flex-wrap -m-4">
              {Object.keys(products).length === 0 && <p>Sorry Pants are Unavialable</p>}
              {Object.keys(products).map((item) => {
                return <div key={products[item]._id} className="lg:w-1/5 md:w-1/2 p-4 w-full shadow-lg cursor-pointer">
                  <Link href={`/product/${products[item].slug}`} className='block relative  rounded overflow-hidden'>
                    <img alt="ecommerce" className="m-auto justify-center md:h[34vh] h-[30vh] block" src={products[item].img} />

                    <div className="mt-4 mx-2 text-center md:text-left">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Pants</h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                      <p className="mt-1">₹{products[item].price}.00</p>
                      <p className="mt-1">
                        {products[item].size.includes("S") && <span className='border px-1 border-grey-400 mx-1'>S</span>}
                        {products[item].size.includes("M") && <span className='border px-1 border-grey-400 mx-1'>M</span>}
                        {products[item].size.includes("L") && <span className='border px-1 border-grey-400 mx-1'>L</span>}
                        {products[item].size.includes("Xl") && <span className='border px-1 border-grey-400 mx-1'>XL</span>}
                        {products[item].size.includes("XXl") && <span className='border px-1 border-grey-400 mx-1'>XXL</span>}</p>
                    </div>
                    <div className="mt-1">
                      {products[item].color.includes("green") && <button className="border-2 border-gray-300 ml-1 bg-green-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("red") && <button className="border-2 border-gray-300 ml-1 bg-red-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("blue") && <button className="border-2 border-gray-300 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("pink") && <button className="border-2 border-gray-300 ml-1 bg-pink-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("grey") && <button className="border-2 border-gray-300 ml-1 bg-gray-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("purple") && <button className="border-2 border-gray-300 ml-1 bg-purple-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("white") && <button className="border-2 border-gray-300 ml-1 bg-white rounded-full w-6 h-6 focus:outline-none"></button>}
                      {products[item].color.includes("black") && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                    </div>
                  </Link>
                </div>
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {

    await mongoose.connect(process.env.MONGO_URI)
  }
  let products = await Product.find({ category: "Pants" })
  let Pants = {};

  for (const item of products) {
    if (item.title in Pants) {
      if (!Pants[item.title].color.includes(item.color) && item.availableQty > 0) {
        Pants[item.title].color.push(item.color)
      }
      if (!Pants[item.title].size.includes(item.size) && item.availableQty > 0) {
        Pants[item.title].size.push(item.size)
      }

    }

    else {
      Pants[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        Pants[item.title].color = [item.color]
        Pants[item.title].size = [item.size]
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(Pants)) }, // will be passed to the page component as props
  }
}

export default Pants