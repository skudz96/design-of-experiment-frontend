import React, { useState, useEffect } from "react";

interface TableProps {
  matrix: number[][];
  levelMapping: { [columnIndex: number]: { [level: number]: string } };
  setLevelMapping: (mapping: {
    [columnIndex: number]: { [level: number]: string };
  }) => void;
}

export default function Table({
  matrix,
  levelMapping,
  setLevelMapping,
}: TableProps) {
  // Add state for header names
  const [headerNames, setHeaderNames] = useState<string[]>(
    () => matrix[0]?.map((_, i) => `Factor ${i + 1}`) || []
  );

  // Update header names when matrix changes
  useEffect(() => {
    if (matrix[0]) {
      setHeaderNames(matrix[0].map((_, i) => `Factor ${i + 1}`));
    }
  }, [matrix]);

  // Initialize level mapping if empty or matrix structure changes
  useEffect(() => {
    if (!matrix || matrix.length === 0) return;

    // Check if levelMapping is empty or doesn't match current matrix structure
    const needsInitialization = matrix[0].some(
      (_, columnIndex) =>
        !levelMapping[columnIndex] ||
        typeof levelMapping[columnIndex] !== "object"
    );

    if (needsInitialization) {
      const newMapping: { [columnIndex: number]: { [level: number]: string } } =
        {};

      // Initialize mapping for each column in the matrix
      matrix[0].forEach((_, columnIndex) => {
        // Ensure each column has its own mapping object
        newMapping[columnIndex] = {};

        // Get unique levels for this specific column by checking all rows
        const uniqueLevels = [
          ...new Set(matrix.map((row) => row[columnIndex])),
        ];

        // Create default mapping for each unique level in this column
        uniqueLevels.forEach((level) => {
          // If existing mapping exists and is valid, preserve it, otherwise use default
          if (
            levelMapping[columnIndex] &&
            typeof levelMapping[columnIndex] === "object" &&
            levelMapping[columnIndex][level]
          ) {
            newMapping[columnIndex][level] = levelMapping[columnIndex][level];
          } else {
            newMapping[columnIndex][level] = level.toString();
          }
        });
      });

      setLevelMapping(newMapping);
    }
  }, [matrix, levelMapping, setLevelMapping]);

  if (!matrix || matrix.length === 0) {
    return null;
  }

  // function to update header names
  function handleHeaderNameChange(index: number, name: string) {
    const newHeaderNames = [...headerNames];
    newHeaderNames[index] = name;
    setHeaderNames(newHeaderNames);
  }

  // function to update the levelMapping state for specific column and level
  function handleColumnLevelNameChange(
    columnIndex: number,
    level: number,
    name: string
  ) {
    const newMapping = {
      ...levelMapping,
      [columnIndex]: {
        ...levelMapping[columnIndex],
        [level]: name,
      },
    };
    setLevelMapping(newMapping);
  }

  // function that converts the matrix data into csv format
  function exportToCSV() {
    const headers = ["Experiment", ...headerNames];
    const rows = matrix.map((row, rowIndex) => [
      rowIndex + 1,
      ...row.map(
        (cell, columnIndex) => levelMapping[columnIndex]?.[cell] || cell
      ),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "design_matrix.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-gray-300">Experiment</th>
            {headerNames.map((headerName, i) => (
              <th key={i} className="py-2 px-4 border border-gray-300">
                <input
                  type="text"
                  value={headerName}
                  onChange={(e) => handleHeaderNameChange(i, e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-center font-semibold"
                  placeholder={`Factor ${i + 1}`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="py-2 px-4 border border-gray-300 text-center font-bold">
                {rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="py-2 px-4 border border-gray-300 text-center"
                >
                  {levelMapping[cellIndex]?.[cell] || cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 w-full max-w-6xl">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Customize Level Names by Column
        </h3>
        {/* Grid layout that creates columns for each factor */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${headerNames.length}, 1fr)` }}
        >
          {headerNames.map((headerName, columnIndex) => (
            // Creates a section for each column/factor
            <div
              key={columnIndex}
              className="border border-gray-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-gray-800 mb-3 text-center">
                {headerName}
              </h4>
              <div className="space-y-2">
                {/* Maps over the levels in each column to create input fields */}
                {levelMapping[columnIndex] &&
                  Object.entries(levelMapping[columnIndex]).map(
                    ([level, name]) => (
                      <div key={level} className="flex items-center space-x-2">
                        <label
                          htmlFor={`level-${columnIndex}-${level}`}
                          className="text-sm font-medium text-gray-600 w-16 flex-shrink-0"
                        >
                          Level {level}:
                        </label>
                        {/* Input field for customizing level names for this specific column */}
                        <input
                          id={`level-${columnIndex}-${level}`}
                          type="text"
                          value={name}
                          onChange={(e) =>
                            handleColumnLevelNameChange(
                              columnIndex,
                              Number(level),
                              e.target.value
                            )
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          placeholder={`Name for level ${level}`}
                        />
                      </div>
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={exportToCSV}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        Export to CSV
      </button>
    </div>
  );
}
