import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-surface py-8 border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <p className="flex items-center justify-center text-text-secondary mb-4">
          Made with <FaHeart className="text-red-500 mx-2" /> by Suryachalam V M
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SGK18. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
