import React from "react";

const FailedTask = ({ data }) => {
  return (
    <div className="flex-shrink-0 h-full w-[400px] p-5 bg-blue-400 rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="bg-red-600 text-sm px-3 py-1 rounded">werterg</h3>
        <h4 className="text-sm">wetrwt</h4>
      </div>
      <h2 className="mt-5 text-2xl font-semibold">wertw</h2>
      <p className="text-sm mt-2">ewrtewt</p>
      <div className="my-2">
        <button className="w-full bg-red-500 rounded font-medium py-1 px-2 text-xs">
          Failed
        </button>
      </div>
    </div>
  );
};

export default FailedTask;
