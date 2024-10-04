import { useState, useEffect } from "react"
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { db } from "./data/db"

function App() {

  const initialState = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }
  
  const [data] = useState(db)
  const [cart, setCart] = useState(initialState) //el state es inmutable, no se tiene que modificar

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]) //useeffect se usa para los efectos secundarios de cuando nuestro state cambia
  // useEffect(() =>{
  //   setData(db); Si es que es una conexion a una API siempre es con useEffect
  // }, [])
  // const [auth, setAuth] = useState(false)

  // useEffect(()=>{
  //   if(auth){
  //     console.log("Autenticado")
  //   }
  // }, [auth])

  //State 
  // const [auth, setAuth] = useState(false)
  // const [total, setTotal] = useState(0)
  // const [cart, setCart] = useState([])

  function addToCart(item) {
    //Es importante saber cuando modificamos o no un arreglo(mutabilidad), usar doesitmutate.xyz

    const itemExists = cart.findIndex(guitar => guitar.id === item.id) //evalua si alguna guitar coincide con la que seleccionamos y devuelve la posicion o -1
    if(itemExists >= 0){ //existe en el carrito
      if(cart[itemExists].quantity >= MAX_ITEMS) return //el return no devuelve nada por lo que el codigo de abajo no se ejecuta
      const updatedCart = [...cart] //como no podemos mutar el state hacemos una copia
      updatedCart[itemExists].quantity++ 
      setCart(updatedCart)
    
    }else{
      item.quantity = 1
      setCart([...cart, item]) //le agrego el carrito que tenia y luego el nuevo elemento
    }
  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)) //filtro o saco los que no coincidan con el guitar.id que selecciono
  }

  function increaseQuantity(id){
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity < MAX_ITEMS){
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id){
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity > MIN_ITEMS){
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function clearCart(){
    setCart([])
  }
  

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) =>
          (
            <Guitar
              key={guitar.id}
              guitar={guitar} //le paso todas las guitars de la data
              setCart={setCart}
              addToCart={addToCart}
            />
          )
          )}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
