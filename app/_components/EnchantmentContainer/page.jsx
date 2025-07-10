import React from "react";
import Item from "../Item/page";

import items from "../../assets/enchants.json";

const page = () => {
    const book_src =
        "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png";
    return (
        <div className="flex flex-col w-[70%] bg-[#44403C] border-2 rounded-md shadow-lg shadow-gray-500/50 p-4 my-4 mx-auto">
            <span className="text-3xl text-gray-300 mx-10 my-4">
                Select Books for Enchantment
            </span>
            <div className="grid grid-cols-6 justify-center items-center gap-y-6">
                {items.map((item) => (
                    <Item key={item.name} name={item.name} image={book_src} />
                ))}
            </div>
        </div>
    );
};

export default page;
