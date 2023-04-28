import { Link } from '@remix-run/react';

export function Navbar() {
  return (
    <div className="h-16 fixed top-0 z-10 flex w-full items-center p-4 backdrop-blur-sm bg-white/50 border-b border-slate-800">
      <h1 className="basis-1/4 font-bold text-3xl">Formula 1 Explorer</h1>
      <nav className="w-full">
        <ul className="flex space-x-8">
          <li className="text-xl">
            <Link to="drivers">Drivers</Link>
          </li>
          <li className="text-xl">
            <Link to="constructors">Constructors</Link>
          </li>
          <li className="text-xl">
            <Link to="circuits">Circuits</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
