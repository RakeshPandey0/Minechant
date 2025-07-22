"use client";

import { CircleX } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Page = () => {
    const { loading, error, result } = useSelector(
        (state) => state.enchantment
    );
    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        if (!loading && result) {
            setShowSplash(true);
        }
    }, [loading, result]);

    // skeleton loading state
    if (loading) {
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50">
                <div className="bg-gray-300 w-[90%] sm:w-[50%] max-h-[90vh] overflow-auto rounded-xl shadow-lg relative p-6 animate-pulse">
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-[60%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[40%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[30%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[50%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[60%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[30%]"></div>
                        <div className="h-4 bg-gray-200 rounded w-[40%]"></div>
                    </div>
                </div>
            </div>
        );
    }

    // data handling
    if (result && showSplash) {
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50">
                <div className="bg-gray-300 w-[90%] sm:w-[50%] max-h-[90vh] overflow-auto rounded-xl shadow-lg relative p-6">
                    <button
                        onClick={() => setShowSplash(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:cursor-pointer font-bold"
                    >
                        <CircleX className="w-8 h-8" />
                    </button>

                    <div className="space-y-2 text-gray-800 text-lg ">
                        {result.map((str, index) => (
                            <div key={index}>{str},</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // error handling
    if (error) {
        console.error("Error:", error);
    }

    return null;
};

export default Page;
