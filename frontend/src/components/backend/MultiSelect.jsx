"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

// Single Select Component
export function SingleSelect({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    required = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const selectedOption = options.find(
        (option) => option.id.toString() === value.toString()
    );

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative mt-1" ref={dropdownRef}>
            <div
                className={`flex items-center justify-between px-3 py-2 bg-gray-50 border ${
                    isOpen
                        ? "border-green-500 ring-1 ring-green-500"
                        : "border-gray-300"
                } rounded-md cursor-pointer`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1 truncate">
                    {selectedOption ? selectedOption.name : placeholder}
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                                    option.id.toString() === value.toString()
                                        ? "bg-green-50"
                                        : ""
                                }`}
                                onClick={() => {
                                    onChange(option.id.toString());
                                    setIsOpen(false);
                                    setSearchTerm("");
                                }}
                            >
                                <span>{option.name}</span>
                                {option.id.toString() === value.toString() && (
                                    <Check className="h-4 w-4 text-green-500" />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-500">
                            No options found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Multi Select Component
export function MultiSelect({
    options,
    value = [],
    onChange,
    placeholder = "Select options",
    onCreate, // new prop for inline creation
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const selectedOptions = options.filter((option) =>
        value.includes(option.id?.toString() ?? "")
    );

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optionId) => {
        const optionIdStr = optionId?.toString() ?? "";
        if (value.includes(optionIdStr)) {
            onChange(value.filter((id) => id !== optionIdStr));
        } else {
            onChange([...value, optionIdStr]);
        }
    };

    const removeOption = (e, optionId) => {
        e.stopPropagation();
        onChange(value.filter((id) => id !== optionId?.toString() ?? ""));
    };

    return (
        <div className="relative mt-1" ref={dropdownRef}>
            <div
                className={`min-h-[42px] flex items-center flex-wrap gap-1 px-3 py-2 bg-gray-50 border ${
                    isOpen
                        ? "border-green-500 ring-1 ring-green-500"
                        : "border-gray-300"
                } rounded-md cursor-pointer`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((option) => (
                        <div
                            key={option.id}
                            className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-md flex items-center"
                        >
                            {option.name}
                            <X
                                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                                onClick={(e) => removeOption(e, option.id)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">{placeholder}</div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Search tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                                value.includes(option.id?.toString() ?? "")
                                    ? "bg-green-50"
                                    : ""
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleOption(option.id);
                            }}
                        >
                            <span>{option.name}</span>
                            {value.includes(option.id?.toString() ?? "") && (
                                <Check className="h-4 w-4 text-green-500" />
                            )}
                        </div>
                    ))}

                    {/* New option to create a tag/category */}
                    {onCreate &&
                        searchTerm.trim() !== "" &&
                        !options.some(
                            (option) =>
                                option.name.toLowerCase() ===
                                searchTerm.toLowerCase()
                        ) && (
                            <div
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-green-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCreate(searchTerm);
                                    setSearchTerm("");
                                    setIsOpen(false);
                                }}
                            >
                                Create "{searchTerm}"
                            </div>
                        )}

                    {/* Fallback when no options found */}
                    {!filteredOptions.length &&
                        (!onCreate || searchTerm.trim() === "") && (
                            <div className="px-3 py-2 text-gray-500">
                                No options found
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
