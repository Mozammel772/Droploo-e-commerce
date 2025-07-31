import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center bg-white">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Oops! Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        The page you are looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Error;
