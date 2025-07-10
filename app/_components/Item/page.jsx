import Image from "next/image";
import React from "react";

const Page = ({ name, level, image }) => {
    return (
        <div className="flex flex-col justify-center items-center">
            {name?.toLowerCase() !== "book" && (
                <>
                    <div className="group/Item-box flex flex-wrap justify-center items-center w-30 h-30 m-1 bg-[#1C4464] border-2 rounded-xl">
                        <div className="relative">
                            <Image
                                width={80}
                                height={80}
                                src={
                                    image ||
                                    "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png"
                                }
                                alt={`${name || "Item"} image here`}
                            />
                            {level || (
                                <div className="absolute w-8 h-8 flex justify-center items-center -top-3 -right-2 bg-amber-300 rounded-full">
                                    <span className="text-gray-800 text-xl self-center font-black pl-1 pt-0.5">
                                        {level || "IV"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-gray-400 text-2xl capitalize min-h-10 mx-auto rounded px-2 max-w-full text-center">
                        {name}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
