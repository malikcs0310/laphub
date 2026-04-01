import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
        Page not found
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white text-base sm:text-lg font-semibold rounded shadow hover:bg-indigo-700 transition-all"
        >
          Go back home
        </Link>
        <Link
          to="/contact"
          className="text-base sm:text-lg font-semibold text-indigo-600 hover:underline"
        >
          Contact support →
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
