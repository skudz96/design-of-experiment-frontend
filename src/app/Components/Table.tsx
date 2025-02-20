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
  if (!matrix || matrix.length === 0) {
    return null;
  }

  // function to update the levelMapping state, renaming the levels
  function handleLevelNameChange(level: number, name: string) {
    setLevelMapping({ ...levelMapping, [level]: name });
  }

  // function that converts the matrix data into csv format
  // creates the CSV by joining the headers and rows with commas and newlines
  // creates blob object from the CSV content and a temporary link element to trigger the download
  function exportToCSV() {
    const headers = [
      "Experiment",
      ...matrix[0].map((_, i) => `Factor ${i + 1}`),
    ];
    const rows = matrix.map((row, rowIndex) => [
      rowIndex + 1,
      ...row.map((cell) => levelMapping[cell] || cell),
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
          {/* Table header start */}
          <tr>
            {/* First column header for experiment numbering */}
            <th className="py-2 px-4 border border-gray-300">Experiment</th>
            {matrix[0].map(
              // Maps starting from the first row in the matrix
              (_, i) => (
                // Iterates over its elements, ignores the values
                <th
                  key={i}
                  className="py-2 px-4 border border-gray-300"
                  contentEditable={true}
                >
                  Factor {i + 1}
                  {/* Creates as many column heads as there are elements (factors) in the matrix */}
                </th>
              )
            )}
          </tr>
        </thead>
        {/* Table header end */}
        <tbody>
          {/* Table body start */}
          {matrix.map(
            // Iterates over each row (array) in the matrix
            (row, rowIndex) => (
              // Creates a table row for each array
              <tr key={rowIndex}>
                <td className="py-2 px-4 border border-gray-300 text-center font-bold">
                  {rowIndex + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  // Iterates over the contents of each row (array) in the matrix
                  // Creates a data cell for each one
                  // populates the cell with the content
                  <td
                    key={cellIndex}
                    className="py-2 px-4 border border-gray-300 text-center"
                  >
                    {levelMapping[cell] || cell}
                    {/* If the levelMapping object has a key that matches the cell value, it uses the value of that key as the cell content */}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
        {/* Table body end */}
      </table>

      <form className="mt-4">
        <div className="flex flex-wrap  gap-4">
          {/* form element that generates input fields based on number of levels */}
          {Object.keys(levelMapping).map((level) => (
            // Returns an array of the keys of the levelMapping object
            // each key represents a level in the matrix
            // maps over each level and creates an input field for it
            // the input field is pre-populated with the value of the key

            // useEffect hook in page.tsx updates the levelMapping object when the levels array changes
            <div key={level} className="flex items-center space-x-2">
              <label
                htmlFor={`level-${level}`}
                className="text-sm font-medium text-gray-700"
              >
                Level {level}
              </label>
              <input
                id={`level-${level}`}
                type="text"
                value={levelMapping[Number(level)]}
                onChange={(e) =>
                  handleLevelNameChange(Number(level), e.target.value)
                }
                className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder={`Enter name for level ${level}`}
              />
            </div>
          ))}
        </div>
      </form>
      {/* Button that executes csv exports function on click */}
      <button
        onClick={exportToCSV}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        Export to CSV
      </button>
    </div>
  );
}
