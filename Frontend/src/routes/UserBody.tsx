import React from 'react'
import NavBar from '../user/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../user/Footer'

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
