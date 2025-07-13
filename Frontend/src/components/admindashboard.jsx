import React from 'react';
import AdminHeader from '../other/AdminHeader';
import Createtask from '../other/createtask';
import AllTask from '../other/alltask';


const admindashboard = () => {

  return (
    <div className="absolute inset-0 -z-10 h-screen w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px] p-10"></div>
        <AdminHeader/>
        <Createtask/>
        <AllTask/>
    </div>
  )
}

export default admindashboard;