import React from "react";
import enchantments from "../../assets/enchants.json";
import Enchant from "../Enchant/page";
import { useSelector } from "react-redux";

const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V"];
    return roman[num] || "";
};

const page = () => {
    const { selected_items } = useSelector((state) => state.selection);
    const book_src =
        "https://res.cloudinary.com/dbmievfdc/image/upload/v1752140164/Enchanted_Book_yqp0ro.png";

    return (
        selected_items[0] && (
            <div className="flex flex-col w-[70%] bg-[#31302f] border-2 rounded-md shadow-lg shadow-gray-500/50 p-4 my-4 mx-auto">
                <span className="text-3xl text-gray-300 mx-10 my-4">
                    Select Books for Enchantment
                </span>
                <div className="flex flex-col gap-y-6">
                    {enchantments
                        .filter((enchantment) =>
                            enchantment.items.includes(selected_items[0])
                        )
                        .map((enchantment, index) => {
                            const maxLevel = enchantment.levelMax;
                            return (
                                <div
                                    key={enchantment.name}
                                    className="grid grid-cols-5 content-center gap-x-8"
                                >
                                    {Array.from(
                                        { length: maxLevel },
                                        (_, i) => (
                                            <Enchant
                                                key={`${enchantment.name}_${i}`}
                                                name={`${enchantment.name} ${
                                                    enchantment.levelMax > "1"
                                                        ? toRoman(i)
                                                        : ""
                                                }`}
                                                level={
                                                    enchantment.levelMax > "1"
                                                        ? toRoman(i)
                                                        : ""
                                                }
                                                image={book_src}
                                                rowIndex={index}
                                                incompatible={
                                                    enchantment.incompatible
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        )
    );
};

export default page;
