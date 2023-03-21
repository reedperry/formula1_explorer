import { Link } from "@remix-run/react";

export function Navbar() {
  return (
    <div className="h-18 sticky top-0 flex w-full items-center p-4">
      <h1 className="basis-1/4 text-2xl">Formula 1 Explorer</h1>
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
