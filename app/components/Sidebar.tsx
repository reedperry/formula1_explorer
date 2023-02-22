import { Link } from "@remix-run/react";

export default function Sidebar() {
  return (
    <div className={`sticky w-80 h-full overflow-y-auto overflow-x-hidden p-3`}>
      <h1 className="text-2xl m-6">Formula 1 Explorer</h1>
      <ul>
        <li>
          <Link to="drivers">Drivers</Link>
        </li>
        <li>
          <Link to="circuits">Circuits</Link>
        </li>
      </ul>
    </div>
  )
}