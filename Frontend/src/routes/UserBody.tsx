import React from 'react'
import NavBar from '../pages/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../pages/Footer'

const UserBody = () => {
  return (
    <div>
      <NavBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default UserBody
