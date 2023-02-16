import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const drivers = await prisma.driver.findMany({ take: 10 });
  return json({ drivers });
}

export default function DriversPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Drivers</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white">
        <ul>
          {data.drivers.map(driver => {
            return <li key={driver.code}>
              <span>{driver.number}: {driver.forename} {driver.surname}</span>
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
