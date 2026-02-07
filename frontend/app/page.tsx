import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Todo App
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Manage your tasks efficiently with our simple and intuitive todo application
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md border-2 border-indigo-600"
          >
            Log In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Simple & Easy
            </h3>
            <p className="text-gray-600">
              Create, edit, and complete tasks with just a few clicks
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your tasks are completely private and secure with JWT authentication
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cloud Synced
            </h3>
            <p className="text-gray-600">
              Access your tasks from anywhere with cloud persistence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
