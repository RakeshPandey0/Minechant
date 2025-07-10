import React from "react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
const page = ({itemName, level, image}) => {
  return (
    
      <div>
        <div className=" group/Item-box flex flex-wrap justify-center items-center w-35 h-35 m-1 bg-[#1C4464] border-4 rounded-xl">
          <div className="relative inline-block">
            <img
              src={image}
              alt="image here"
              className="w-20 h-20 rounded-md object-cover "
            />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-md font-bold px-2 py-0.5 rounded-full">
              {level}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col text-2xl">
            <div>
                {itemName}
            </div>
            <div>
                {level}
            </div>
        </div>
      </div>
  );
};

export default page;
