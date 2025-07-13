import React from "react";

const NewTask = ({ data }) => {
  return (
    <div className="flex-shrink-0 h-full w-[400px] p-5 bg-red-400 rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="bg-red-600 text-sm px-3 py-1 rounded">sdfg</h3>
        <h4 className="text-sm">dsgdsg</h4>
      </div>
      <h2 className="mt-5 text-2xl font-semibold">dsfgds</h2>
      <p className="text-sm mt-2">sdfgdaf</p>
      <div className="mt-6">
        <button className="bg-blue-500 rounded font-medium py-1 px-2 text-xs">
          Accept Task
        </button>
      </div>
    </div>
  );
};

export default NewTask;
