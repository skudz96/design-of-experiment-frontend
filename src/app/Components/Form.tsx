"use client";

import { useState } from "react";

// Defining types for the props coming from the parent component
// This is a good practice to ensure that the props are of the correct type
interface FormProps {
  factor: number;
  setFactors: (value: number) => void;
  levels: number[];
  setLevels: (value: number[]) => void;
  halfFactorial: boolean;
  setHalfFactorial: (value: boolean) => void;
  generateDesignMatrix: (
    factors: number,
    levels: number[],
    halfFactorial: boolean
  ) => number[][];
}

export default function Form({
  factor,
  setFactors,
  levels,
  setLevels,
  halfFactorial,
  setHalfFactorial,
  generateDesignMatrix,
}: FormProps) {
  const [arrayValue, setArrayValue] = useState("");

  // Event handler for input change
  // Basically splits the comma separated values into an array, which matrix function expects
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setArrayValue(value);
    const array = value.split(",").map(Number);
    setLevels(array);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    // Testing to see form logs arguments in correct format, remove if not needed
    console.log("Number of factors: ", factor);
    console.log("Number of levels: ", levels);
    console.log("Half-factorial: ", halfFactorial);

    // Executing the function passed from the parent component with the formatted arguments, generates the matrix in the console
    generateDesignMatrix(factor, levels, halfFactorial);
  };

  return (
    <form // runs the function handleSubmit when the form is submitted
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-8 transition-all duration-300 hover:shadow-lg"
    >
      {/* NUMBER OF VARIABLES */}

      <div className="mb-6">
        <label
          htmlFor="integer"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of factors
        </label>
        <input // Variable for the number of factors, strictly integer
          id="integer"
          type="number"
          value={factor} // value it set to the passed state variable from parent component
          onChange={(e) => setFactors(Number(e.target.value))} // state variable updated when user types
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          placeholder="Enter number of variables"
        />
      </div>

      {/* NUMBER OF LEVELS */}
      <div className="mb-6">
        <label
          htmlFor="array"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of levels
        </label>
        <input // Variable for the number of levels, comma separated
          id="array"
          type="text"
          value={arrayValue}
          onChange={handleInputChange} // running handleInputChange function to convert comma separated values to an array, which the matrix generation function expects
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          placeholder="Enter comma-separated values"
        />
      </div>

      {/* FACTORIAL BOOLEAN */}

      <div className="flex items-center justify-between mb-6">
        <label htmlFor="boolean" className="text-sm font-medium text-gray-700">
          Half-factorial?
        </label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            name="boolean"
            id="boolean"
            checked={halfFactorial}
            onChange={(e) => setHalfFactorial(e.target.checked)}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="boolean"
            className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
              halfFactorial ? "bg-blue-500" : ""
            }`}
          ></label>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
