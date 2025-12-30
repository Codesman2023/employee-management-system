import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const AdminHeader = () => {
  const [adminName, setAdminName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admins/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Adjust according to your backend response structure
        if (res.data && res.data.user) {
          const usr = res.data.user;
          if (usr.name) setAdminName(usr.name);
          else if (usr.fullname) setAdminName(`${usr.fullname.firstname} ${usr.fullname.lastname}`);
          else setAdminName(usr.email || '');
        }
      } catch (err) {
        setAdminName('')
      }
    }
    fetchAdmin()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/AdminLogin');
  }

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-3xl text-gray-200 font-medium ml-5 mt-2'>
        Hello, <br />
        <span className='text-4xl'>{adminName || 'Admin'}</span>
      </h1>
      <button onClick={handleLogout} type="submit" className='self-center bg-red-600 text-lg font-medium text-white px-3 py-2 rounded-xl mr-5 cursor-pointer hover:bg-red-700'>Log out</button>
    </div>
  )
}

export default AdminHeader