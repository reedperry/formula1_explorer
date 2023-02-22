
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const circuits = await prisma.circuit.findMany({
    select: {
      circuitId: true,
      circuitRef: true,
      alt: true,
      country: true,
      location: true,
      name: true,
      url: true,
      races: {
        where: {
          year: 2022
        },
        orderBy: {
          date: 'desc'
        },
        take: 1,
        select: {
          raceId: true,
          date: true,
          results: {
            where: {
              positionText: "1"
            },
            include: {
              drivers: true
            }
          }
        }

      }
    },
    orderBy: {
      name: 'asc'
    },
  });

  return json({ circuits });
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

      <main className="flex h-full bg-white">
        <ul>
          {data.circuits.map(circuit => {
            return <li key={circuit.circuitRef}>
              <Link to={circuit.circuitId.toString()}>
                <span>{circuit.name} ({circuit.country})</span>
              </Link>
              <div>{circuit.races.map(r =>
                <small key={r.raceId}>Winner on {r.date} - {r.results[0].drivers.surname}</small>
              )}</div>
            </li>
          })}
        </ul>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
