import { NavLink } from 'react-router-dom';

export function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-indigo-700 text-lg tracking-tight">
          🎯 AI Interview
        </span>
        <div className="flex gap-1">
          <NavLink to="/configure" className={linkClass}>
            Configure
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            Checkout
          </NavLink>
          <NavLink to="/question-bank" className={linkClass}>
            Question Bank
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
