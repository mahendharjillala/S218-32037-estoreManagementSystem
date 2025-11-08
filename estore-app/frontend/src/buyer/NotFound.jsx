import { Link } from 'react-router-dom';
import notfound from './notfound.png';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mb-8">
          <img 
            src={notfound} 
            alt="Page Not Found" 
            className="max-w-full h-auto mx-auto rounded-lg shadow-md"
          />
        </div>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}