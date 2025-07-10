import Image from "next/image";
import React from "react";

const page = ({ itemName, level, image }) => {
    return (
        <div>
            <div className=" group/Item-box flex flex-wrap justify-center items-center w-35 h-35 m-1 bg-[#1C4464] border-2 rounded-xl">
                <div className="relative inline-block">
                    <Image
                        width={20}
                        height={20}
                        src={
                            image ||
                            "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png"
                        }
                        alt={`${itemName} image here`}
                        className="w-20 h-20 rounded-md object-cover "
                    />
                    {level && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-md font-bold px-2 py-0.5 rounded-full">
                            {level}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center flex-col text-2xl">
                <div>{itemName || "Item Name"}</div>
            </div>
        </div>
    );
};

export default page;
