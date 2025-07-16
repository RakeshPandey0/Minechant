import React from "react";
import Item from "../Item/page";
import items from "../../assets/enchants.json";
import Enchant from "../Enchant/page"

const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V"];
    return roman[num] || "";
};

const page = () => {
    const book_src =
        "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png";

    return (
        <div className="flex flex-col w-[70%] bg-[#31302f] border-2 rounded-md shadow-lg shadow-gray-500/50 p-4 my-4 mx-auto">
            <span className="text-3xl text-gray-300 mx-10 my-4">
                Select Books for Enchantment
            </span>
            <div className="flex flex-col gap-y-6">
                {items.map((item) => {
                    const maxLevel = item.levelMax;
                    return (
                        <div
                            key={item.name}
                            className="grid grid-cols-5 content-center gap-x-8"
                        >
                            {Array.from({ length: maxLevel }, (_, i) => (
                                <Enchant
                                    key={`${item.name}_${i}`}
                                    name={`${item.name} ${
                                        item.levelMax > "1" ? toRoman(i) : ""
                                    }`}
                                    level={
                                        item.levelMax > "1" ? toRoman(i) : ""
                                    }
                                    image={book_src}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default page;
