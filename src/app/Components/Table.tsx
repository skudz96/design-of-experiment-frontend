import React, { useState, useEffect } from "react";

interface TableProps {
  matrix: number[][];
  levelMapping: { [key: number]: string };
  setLevelMapping: (mapping: { [key: number]: string }) => void;
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

  // State to store the shuffled matrix and track if it's randomized
  const [displayMatrix, setDisplayMatrix] = useState<number[][]>(matrix);
  const [isRandomized, setIsRandomized] = useState<boolean>(false);

  // Internal state for column-specific level mapping
  // This converts the flat levelMapping to column-specific format
  const [columnLevelMapping, setColumnLevelMapping] = useState<{
    [columnIndex: number]: { [level: number]: string };
  }>(() => {
    if (!matrix || matrix.length === 0) return {};

    const mapping: { [columnIndex: number]: { [level: number]: string } } = {};

    // Initialize mapping for each column
    matrix[0].forEach((_, columnIndex) => {
      mapping[columnIndex] = {};

      // Get unique levels for this column
      const uniqueLevels = [...new Set(matrix.map((row) => row[columnIndex]))];
      uniqueLevels.forEach((level) => {
        // Use existing levelMapping if available, otherwise use default
        mapping[columnIndex][level] = levelMapping[level] || level.toString();
      });
    });

    return mapping;
  });

  // Update header names when matrix changes
  useEffect(() => {
    if (matrix[0]) {
      setHeaderNames(matrix[0].map((_, i) => `Factor ${i + 1}`));
    }
  }, [matrix]);

  // Update display matrix when original matrix changes
  useEffect(() => {
    setDisplayMatrix(matrix);
    setIsRandomized(false); // Reset randomization state when matrix changes
  }, [matrix]);

  // Update column mappings when matrix or levelMapping changes
  useEffect(() => {
    if (!matrix || matrix.length === 0) return;

    // Use functional update to avoid needing columnLevelMapping in dependencies
    setColumnLevelMapping((prevColumnMapping) => {
      const newMapping: { [columnIndex: number]: { [level: number]: string } } =
        {};

      // Initialize mapping for each column in the matrix
      matrix[0].forEach((_, columnIndex) => {
        newMapping[columnIndex] = {};

        // Get unique levels for this specific column by checking all rows
        const uniqueLevels = [
          ...new Set(matrix.map((row) => row[columnIndex])),
        ];

        // Create mapping for each unique level in this column
        uniqueLevels.forEach((level) => {
          // Preserve existing column-specific mapping if available
          if (
            prevColumnMapping[columnIndex] &&
            prevColumnMapping[columnIndex][level]
          ) {
            newMapping[columnIndex][level] =
              prevColumnMapping[columnIndex][level];
          } else {
            // Fall back to global levelMapping or default
            newMapping[columnIndex][level] =
              levelMapping[level] || level.toString();
          }
        });
      });

      return newMapping;
    });
  }, [matrix, levelMapping]);

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
    // Update internal column-specific mapping
    setColumnLevelMapping((prev) => ({
      ...prev,
      [columnIndex]: {
        ...prev[columnIndex],
        [level]: name,
      },
    }));

    // Also update the parent's flat levelMapping for backward compatibility
    // This creates a unique key by combining column and level
    const flatKey = columnIndex * 1000 + level; // Simple way to create unique keys
    setLevelMapping({
      ...levelMapping,
      [flatKey]: name,
    });
  }

  // function to randomize the order of matrix rows
  // Creates a copy of the matrix and shuffles the rows using Fisher-Yates algorithm
  // Experiment numbers will reflect the new position after shuffling
  function randomizeRowOrder() {
    const shuffledMatrix = [...displayMatrix];

    // Fisher-Yates shuffle algorithm to randomize array order
    for (let i = shuffledMatrix.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledMatrix[i], shuffledMatrix[j]] = [
        shuffledMatrix[j],
        shuffledMatrix[i],
      ];
    }

    setDisplayMatrix(shuffledMatrix);
    setIsRandomized(true);
  }

  // function to restore the original Yates order of the matrix
  // Resets the display matrix to the original matrix order
  function restoreOriginalOrder() {
    setDisplayMatrix(matrix);
    setIsRandomized(false);
  }

  // function that converts the matrix data into csv format
  // creates the CSV by joining the headers and rows with commas and newlines
  // creates blob object from the CSV content and a temporary link element to trigger the download
  function exportToCSV() {
    const headers = [
      "Experiment",
      ...headerNames, // Use the editable header names
    ];
    const rows = displayMatrix.map((row, rowIndex) => [
      rowIndex + 1, // Use current position as experiment number
      ...row.map(
        (cell, columnIndex) => columnLevelMapping[columnIndex]?.[cell] || cell
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
    <div className="flex flex-col items-center justify-center w-full">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md text-sm">
          <thead>
            {/* Table header start */}
            <tr>
              {/* First column header for experiment numbering */}
              <th className="p-2 border border-gray-300 bg-slate-100">
                Experiment
              </th>
              {headerNames.map((headerName, i) => (
                // Maps over header names to create editable column headers
                <th key={i} className="p-2 border border-gray-300 bg-slate-100">
                  <input
                    type="text"
                    value={headerName}
                    onChange={(e) => handleHeaderNameChange(i, e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-center font-semibold"
                    placeholder={`Factor ${i + 1}`}
                  />
                  {/* Creates editable header inputs for each factor */}
                </th>
              ))}
            </tr>
          </thead>
          {/* Table header end */}
          <tbody>
            {/* Table body start */}
            {displayMatrix.map(
              // Iterates over each row (array) in the display matrix (which may be shuffled)
              (row, rowIndex) => (
                // Creates a table row for each array, experiment numbers reflect current position
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-slate-50" : "bg-white"}
                >
                  <td className="p-2 border border-gray-300 text-center font-bold">
                    {rowIndex + 1}
                    {/* Displays the current position as experiment number (1, 2, 3...) */}
                  </td>
                  {row.map((cell, cellIndex) => (
                    // Iterates over the contents of each row (array) in the matrix
                    // Creates a data cell for each one
                    // populates the cell with the content
                    <td
                      key={cellIndex}
                      className="p-2 border border-gray-300 text-center"
                    >
                      {columnLevelMapping[cellIndex]?.[cell] || cell}
                      {/* Uses column-specific levelMapping to display custom names for levels */}
                      {/* If no custom name exists for this column and level, shows the original cell value */}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
          {/* Table body end */}
        </table>
      </div>

      <div className="mt-6 w-full max-w-6xl">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Customize Level Names by Column
        </h3>
        {/* Grid layout that creates columns for each factor */}
        <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {headerNames.map((headerName, columnIndex) => (
            // Creates a section for each column/factor
            <div
              key={columnIndex}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
            >
              <h4 className="font-medium text-gray-800 mb-3 text-center">
                {headerName}
              </h4>
              <div className="space-y-2">
                {/* Maps over the levels in each column to create input fields */}
                {columnLevelMapping[columnIndex] &&
                  Object.entries(columnLevelMapping[columnIndex]).map(
                    ([level, name]) => (
                      <div
                        key={level}
                        className="flex items-center space-x-2 w-full"
                      >
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
                          className="w-full flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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

      {/* Container for action buttons */}
      <div className="mt-6 flex gap-4">
        {/* Button to randomize the order of experiment rows */}
        <button
          onClick={randomizeRowOrder}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Randomize Row Order
        </button>

        {/* Button to restore original Yates order - only shown when randomized */}
        {isRandomized && (
          <button
            onClick={restoreOriginalOrder}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Restore Original Order
          </button>
        )}

        {/* Button that executes csv exports function on click */}
        <button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}
