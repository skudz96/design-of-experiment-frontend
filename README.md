# Experiment Design Tool

This application is a simple interface for generating factorial design matrices. It is built with **Next.js** and allows you to create full or half-factorial experiments, rename factor levels and export the resulting matrix to CSV.

## Purpose

The tool helps you quickly build experimental matrices when planning a design of experiments (DoE). After providing the number of factors, the levels for each factor and choosing whether you want a half factorial design, the app calculates every run using the [`fast-cartesian`](https://www.npmjs.com/package/fast-cartesian) package.

## Running the application

1. Install dependencies with `npm install` (or your favourite package manager).
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

Alternatively, use [this](https://design-of-experiment-frontend.vercel.app/) deployment link.

## Using the interface

1. **Number of factors** – Enter how many experimental factors you have.
2. **Number of levels** – Provide the levels for those factors as comma separated numbers (e.g. `-1,0,1`).
3. **Half-factorial** – Toggle this option if you want the last column to be a product of the others (creating a half factorial design).
4. Press **Submit** to generate the matrix.
5. Each column header and level name can be edited directly in the table to give them meaningful labels.
6. Press **Randomize Row Order** to shuffle row orders. **Restore Original Order** to revert.
7. Click **Export to CSV** to download the matrix for further analysis.

The generation function restricts designs to a maximum of 3 levels and 6 factors so the total number of runs does not exceed 15.
