
import Footer from '../pages/Footer'
import Header from '../pages/Header'
import { Outlet } from 'react-router-dom'

const Body = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
   
    </div>
  )
}

export default Body
