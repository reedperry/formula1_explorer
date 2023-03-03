import { Link } from "@remix-run/react";

export default function Sidebar() {
  return (
    <div className={`sticky w-72 h-full overflow-y-auto overflow-x-hidden p-3 border-r-4`}>
      <h1 className="text-2xl my-6">Formula 1 Explorer</h1>
      <ul>
        <li>
          <Link to="drivers">Drivers</Link>
        </li>
        <li>
          <Link to="constructors">Constructors</Link>
        </li>
        <li>
          <Link to="circuits">Circuits</Link>
        </li>
      </ul>
    </div>
  )
}