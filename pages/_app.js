import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [subtotal, setSubtotal] = useState(0)
  const [user, setUser] = useState({value : null})
  const [key, setKey] = useState(0)
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    router.events.on('routeChangeStart',()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete',()=>{
      setProgress(100)
    })
   try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
   } catch (error) {
     console.log(error)
     localStorage.clear()
   }

   const myuser = JSON.parse(localStorage.getItem("myuser"))
   if (myuser) {
    setUser({value : myuser.token, email:myuser.email})
    setKey(Math.random())
   }
  }, [router.query])
  
  const Logout = ()=>{
    localStorage.removeItem("myuser")
    setUser({value : null})
    router.push("/")
  } 

  const saveCart = (myCart)=>{
    localStorage.setItem("cart", JSON.stringify(myCart))
    let subt = 0;
    let keys = Object.keys(myCart)
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
      
    }
    setSubtotal(subt)
  }

  const addtoCart = (itemCode, qty, price, name , size, variant)=>{
    if (Object.keys(cart).length == 0) {
      setKey(Math.random())
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    }
    else{
      newCart[itemCode] = {qty:1, price, name, size, variant}
    }

    setCart(newCart)
    saveCart(newCart)
  }

  const buyNow = (itemCode, qty, price, name, size, variant)=>{
    let newCart = {}
    newCart[itemCode] = {qty, price, name, size, variant}
    setCart(newCart)
    saveCart(newCart)
    router.push('/checkout')
  } 
  const clearCart = ()=>{
    setCart({})
    saveCart({})
  }

  const removefromCart = (itemCode, qty, price, name , size, variant)=>{
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
    }
    
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode]
    }
      

    setCart(newCart)
    saveCart(newCart)
  }

  return <>
   <LoadingBar
        color='#f11946'
        waitingTime={700}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
  {<Navbar logout={Logout} key={key} user={user} buyNow={buyNow} cart={cart} addtoCart={addtoCart} removefromCart={removefromCart} subtotal={subtotal} clearCart={clearCart} />}
  <Component buyNow={buyNow} user={user} cart={cart} addtoCart={addtoCart} removefromCart={removefromCart} subtotal={subtotal} clearCart={clearCart} {...pageProps} />;
  <Footer />
  </>
}
