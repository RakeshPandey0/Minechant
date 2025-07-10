import Image from "next/image";
import React from "react";

const page = ({ itemName, level, image }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className=" group/Item-box flex flex-wrap justify-center items-center w-50 h-50 m-1 bg-[#1C4464] border-2 rounded-xl">
        <div className="relative">
          <Image
            width={125}
            height={125}
            src={
              image ||
              "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png"
            }
            alt={`${itemName} image here`}
          />
          {level ||
            ("I" && (
              <div className="absolute w-9 h-9 flex justify-center items-center  -top-3 -right-2 bg-amber-300 rounded-full">
                <span className="text-gray-800 text-2xl self-center font-black pl-1 pt-0.5">
                  {level || "IV"}
                </span>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-center items-center flex-col text-2xl">
        <div>{itemName || "Item Name"}</div>
      </div>
    </div>
  );
};

export default page;
