import Chat from './components/Chat';

function App() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Welcome to Our College
        </h1>
        <p className="text-center text-lg mb-4 text-gray-600">
          How can we assist you today?
        </p>
        <Chat />
      </div>
    </main>
  );
}

export default App;