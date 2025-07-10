import React from "react";
import Item from "../Item/page";

import items from "../../assets/items.json";

const page = () => {
    return (
        <div className="flex flex-col w-[70%] bg-[#44403C] border-2 rounded-md shadow-lg shadow-gray-500/50 p-4 my-4 mx-auto">
            <span className="text-3xl text-gray-300 mx-10 my-4">
                Select an Item to Enchant
            </span>
            <div className="grid grid-cols-6 justify-center items-center gap-y-6">
                {items.map((item) => (
                    <Item key={item.id} name={item.name} image={item.src} />
                ))}
            </div>
        </div>
    );
};

export default page;
