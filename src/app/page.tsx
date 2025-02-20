import Form from "./Components/Form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Data Entry App
        </h1>
        <Form />
      </div>
    </main>
  );
}
