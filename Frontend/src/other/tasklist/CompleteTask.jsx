import React from "react";

const CompleteTask = ({ data }) => {
  return (
    <div className="flex-shrink-0 h-full w-[400px] p-5 bg-green-400 rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="bg-red-600 text-sm px-3 py-1 rounded">rteyh</h3>
        <h4 className="text-sm">fhgf</h4>
      </div>
      <h2 className="mt-5 text-2xl font-semibold">sfdsf</h2>
      <p className="text-sm mt-2">sdfsf</p>
      <div className="my-2">
        <button className="w-full bg-green-600 rounded font-medium py-1 px-2 text-xs">
          Completed
        </button>
      </div>
    </div>
  );
};

export default CompleteTask;
