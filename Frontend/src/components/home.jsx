import React from 'react'
import {Link} from 'react-router-dom'

const home = () => {
  return (
    <div className='bg-gray-500 h-screen flex flex-col justify-between '>
        <header className='bg-gray-900 h-15 text-4xl font-medium pt-2 pl-2 text-white flex justify-center'>Emplyement Management System</header>
        <div className='gap-8 items-center justify-cente flex flex-col '>
            <button type="submit" className='bg-amber-300 h-20 w-60 rounded-2xl font-bold text-2xl cursor-pointer hover:bg-amber-200'><Link to='/EmployeeLogin'>Login as Employee</Link></button>
            <button type="submit" className='bg-red-500 h-20 w-60 rounded-2xl font-bold text-2xl cursor-pointer hover:bg-red-300'><Link to='/AdminLogin'>Login as Admin</Link></button>
        </div>
        <footer className="bg-gray-950 text-gray-300 text-center py-3 shadow-inner">
        &copy; {new Date().getFullYear()} Employement Management System. All rights reserved.
      </footer>
    </div>
  )
}

export default home