import fastCartesian from "fast-cartesian";

// 1. Create a function named `generateDesignMatrix` that takes in three parameters: `factors`, `levels`, and `halfFactorial`. The function should return an array of arrays.
// 2. The `factors` parameter is an integer that represents the number of factors in the design matrix.
// 3. The `levels` parameter is an integer that represents the number of levels for each factor in the design matrix.
// 4. The `halfFactorial` parameter is a boolean that represents whether the design matrix should be a half-factorial design. If `halfFactorial` is `true`, the final column should be the product of all the other factors. If `halfFactorial` is `false`, the final column should be `1`.
// 5. The function should return an array of arrays representing the design matrix. Each inner array should represent a row in the design matrix, and each element in the inner array should represent a factor level.
// 6. The matrix should be generated by passing the array of arrays to the `fast-cartesian` package. You can install the package using `npm install fast-cartesian`.

interface TableProps {
  factors: number;
  levels: number[];
  halfFactorial: boolean;
}
// defining types of arguments
// and saying we are expecting a numeric array of arrays as a return
function generateDesignMatrix(
  factors: number,
  levels: number[],
  halfFactorial: boolean
): number[][] {
  // Check if the criteria are met
  if (levels.length > 3 || factors > 6 || factors * levels.length > 15) {
    throw new Error(
      "Error: Exceeds the limit of 3 levels, 6 factors, and 15 repeats."
    );
  }
  let arrays;

  if (halfFactorial) {
    // Create an array with factors - 1 number of elements, each being the 'levels' array
    arrays = Array(factors - 1).fill(levels);
  } else {
    // Create an array with factors number of elements, each being the 'levels' array
    arrays = Array(factors).fill(levels);
  }

  // Use fastCartesian package to generate all possible combinations
  // a bunch of typescript jargon needed to define the type of the matrix
  let matrix: number[][] = fastCartesian(arrays) as number[][];

  if (halfFactorial) {
    // Add the final column to the matrix
    matrix = matrix.map((row: number[]) => [
      ...row,
      row.reduce((acc, cur) => acc * cur, 1),
    ]);
  }

  return matrix;
}

export default function Table() {
  return (
    <div>
      <table></table>
    </div>
  );
}
