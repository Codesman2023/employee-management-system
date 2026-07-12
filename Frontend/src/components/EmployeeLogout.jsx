import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const EmployeeLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/employees/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            navigate('/login')
        }
    })
    }, [navigate, token])

  return (
    <div>EmployeeLogout</div>
  )
}

export default EmployeeLogout
