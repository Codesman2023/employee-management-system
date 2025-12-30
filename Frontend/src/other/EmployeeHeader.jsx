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
        if (res.data && res.data.user) {
          const user = res.data.user;
          const name = user.name || (user.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : user.email);
          setEmployeeName(name);
        }
      } catch {}
    }
    fetchEmployee()
  }, [])

  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-medium">
        Hello, <br />
        <span className="text-3xl font-semibold text-blue-300">{employeeName || 'Employee'}</span>
      </h1>
    </div>
  )
}

export default EmployeeHeader
