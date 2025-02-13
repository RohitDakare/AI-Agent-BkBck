import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Our College
        </h1>
        <p className="text-center text-lg mb-4">
          How can we assist you today?
        </p>
        <Chat />
      </div>
    </main>
  );
}