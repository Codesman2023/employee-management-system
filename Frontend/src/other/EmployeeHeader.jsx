import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const EmployeeHeader = () => {
  const [employeeName, setEmployeeName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employees/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.data && res.data.user && res.data.user.fullname) {
          setEmployeeName(`${res.data.user.fullname.firstname} ${res.data.user.fullname.lastname}`)
        }
      } catch (err) {
        setEmployeeName('')
      }
    }
    fetchEmployee()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/EmployeeLogin');
  }

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-2xl font-medium ml-5 mt-2'>
        Hello <br />
        <span className='text-3xl font-semibold'>{employeeName || 'Employee'}</span>
      </h1>
      <button onClick={handleLogout} type="submit" className='bg-red-600 text-lg font-medium text-white px-3 py-2 rounded-xl mr-5 cursor-pointer hover:bg-red-700'>Log out</button>
    </div>
  )
}

export default EmployeeHeader