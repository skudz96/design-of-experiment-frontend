interface TableProps {
  matrix: number[][];
}

export default function Table({ matrix }: TableProps) {
  if (!matrix || matrix.length === 0) {
    return null;
  }
  return (
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
              <th key={i} className="py-2 px-4 border border-gray-300">
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
                  {cell}
                </td>
              ))}
            </tr>
          )
        )}
      </tbody>
      {/* Table body end */}
    </table>
  );
}
