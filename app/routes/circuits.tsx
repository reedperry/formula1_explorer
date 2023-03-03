
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader() {
  const circuits = await prisma.circuit.findMany({
    select: {
      circuitId: true,
      circuitRef: true,
      country: true,
      name: true,
    }
  });

  const raceCircuitsThisYear = await prisma.race.findMany({
    select: {
      circuitId: true
    },
    where: {
      year: 2023
    }
  });

  const activeCircuitIds = raceCircuitsThisYear.map(circuit => circuit.circuitId);
  const activeCircuits = circuits.filter(circuit => activeCircuitIds.includes(circuit.circuitId));
  const inactiveCircuits = circuits.filter(circuit => !activeCircuitIds.includes(circuit.circuitId));

  return json({ activeCircuits, inactiveCircuits });
}

export default function CircuitsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full min-h-screen flex-col max-w-screen-lg">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Circuits</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white ml-4">
        <div className="flex-col">
          <h2 className="text-lg font-bold mt-4">Active Circuits</h2>
          <ul>
            {data.activeCircuits.map(circuit => {
              return <li className="my-1" key={circuit.circuitRef}>
                <Link to={circuit.circuitId.toString()}>
                  <span className="hover:font-bold">{circuit.name} ({circuit.country})</span>
                </Link>
              </li>
            })}
          </ul>
          <details>
            <summary className="text-lg font-bold mt-4">Inactive Circuits</summary>
            <ul>
              {data.inactiveCircuits.map(circuit => {
                return <li className="my-1" key={circuit.circuitRef}>
                  <Link to={circuit.circuitId.toString()}>
                    <span className="hover:font-bold">{circuit.name} ({circuit.country})</span>
                  </Link>
                </li>
              })}
            </ul>
          </details>
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
