import Image from "next/image";
import React, { useEffect, useState } from "react";
import enchantments from "@/app/assets/enchants.json";
import { useDispatch, useSelector } from "react-redux";
import {
    selectEnchant,
    removeEnchant,
} from "../../redux/slices/selectionSlice";

const Page = ({ name, level, image, rowIndex, incompatible }) => {
    const { selected_enchants } = useSelector((state) => state.selection);
    const dispatch = useDispatch();

    const handleClick = ({ rowIndex, name, incompatible }) => {
        if (selected_enchants[rowIndex] !== name) {
            const enchantNameOnly = selected_enchants
                .filter((enchant) => typeof enchant === "string")
                .map((enchant) => enchant.split(" ")[0]);

            const checkList = enchantNameOnly.filter((enchant) =>
                incompatible.includes(enchant)
            );

            selected_enchants.forEach((enchant, index) => {
                if (enchant && checkList.includes(enchant.split(" ")[0])) {
                    dispatch(removeEnchant(index));
                }
            });

            dispatch(selectEnchant({ rowIndex, name }));
        } else {
            dispatch(removeEnchant(rowIndex));
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            {name !== "book" && (
                <>
                    <div
                        className={`group/Item-box cursor-pointer flex flex-wrap justify-center items-center w-30 h-30 m-1 ${
                            selected_enchants[rowIndex] === name
                                ? `bg-[#305c4c]`
                                : "bg-[#1C4464] hover:bg-blue-950"
                        } transition-all duration-300 ease-in-out border-2 rounded-xl`}
                    >
                        <div className={`relative `}>
                            <Image
                                width={80}
                                height={80}
                                src={image}
                                alt={`${name} image here`}
                                onClick={() =>
                                    handleClick({
                                        rowIndex,
                                        name,
                                        incompatible,
                                    })
                                }
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

                    <div className="text-gray-400 text-2xl capitalize min-h-10 mx-auto rounded px-2 max-w-full text-center">
                        {name.replaceAll("_", " ")}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
