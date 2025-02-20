import Form from "./Form";
/* import Table from "./Table"; */

export default function Body() {
  return (
    <div className="p-6 space-y 8">
      <h1 className="text-3x1 font-bold text-gray-800 mb-6">
        Experiment Design Tool
      </h1>
      <Form />
    </div>
  );
}
