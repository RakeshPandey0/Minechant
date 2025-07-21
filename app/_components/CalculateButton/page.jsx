import React from "react";
import { useSelector } from "react-redux";

const page = () => {
    const { selected_items, selected_enchants } = useSelector(
        (state) => state.selection
    );
    const isReady = selected_items?.length > 0 && selected_enchants?.length > 0;

    if (!isReady) return null;

    return (
        <button
            tabIndex={0}
            className="flex justify-center items-center mx-auto m-7 w-40 cursor-pointer rounded-2xl p-6 text-white shadow-lg transition-colors ease-in duration-200 bg-[#1C4464] hover:bg-blue-950 focus:outline-none focus:ring-1 border-2 border-white"
        >
            <span className="text-gray-300 text-xl">Calculate</span>
        </button>
    );
};

export default page;
