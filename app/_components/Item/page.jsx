import Image from "next/image";
import React from "react";

const Page = ({ name, level, image }) => {
    return (
        <div className="flex flex-col justify-center items-center cursor-pointer">
            {name !== "book" && (
                <>
                    <div className="flex flex-wrap justify-center items-center w-30 h-30 m-1 bg-[#1C4464] border-2 rounded-xl hover:bg-blue-950 transition-all duration-300 ease-in-out">
                        <div className="relative">
                            <Image
                                width={80}
                                height={80}
                                src={image}
                                alt={`${name} image here`}
                            />
                            {level && (
                                <div className="absolute w-8 h-8 flex justify-center items-center -top-3 -right-2 bg-amber-300 rounded-full">
                                    <span className="text-gray-800 text-xl self-center font-black pl-1 pt-0.5">
                                        {level}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="text-gray-400 text-2xl capitalize mx-auto rounded px-2 max-w-[80%] text-center h-13 flex items-start justify-center"
                        style={{ lineHeight: "1.1" }}
                    >
                        {name.replaceAll("_", " ")}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
