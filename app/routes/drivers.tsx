import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const drivers = await prisma.driver.findMany({
    select: {
      driverId: true,
      driverRef: true,
      surname: true,
      forename: true,
      number: true,
      code: true,
    },
    take: 50,
    orderBy: {
      driverId: 'asc'
    }
  });

  return json({ drivers });
}

export default function DriversPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full min-h-screen flex-col max-w-screen-lg">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Drivers</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white">
        <ul>
          {data.drivers.map(driver => {
            return <li key={driver.driverRef}>
              <Link to={driver.driverId.toString()}>
                <span>{driver.forename} {driver.surname}</span>
                {driver.code ? <span> {driver.code} </span> : null}
              </Link>
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
