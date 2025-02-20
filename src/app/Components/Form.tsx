export default function Form() {
  return (
    <div>
      <form>
        <label htmlFor="factors">Factors:</label>
        <input type="number" id="factors" name="factors" />
        <label htmlFor="levels">Levels:</label>
        <input type="number" id="levels" name="levels" />
        <label htmlFor="halfFactorial">Half Factorial:</label>
        <input type="checkbox" id="halfFactorial" name="halfFactorial" />
        <button type="submit">Generate Matrix</button>
      </form>
    </div>
  );
}
