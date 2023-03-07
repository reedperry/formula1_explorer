import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const activeDriverStandings = await prisma.driverStanding.findMany({
    distinct: ['driverId'],
    select: {
      drivers: {
        select: {
          driverId: true,
          driverRef: true,
          surname: true,
          forename: true,
          number: true,
          code: true,
        }
      }
    },
    orderBy: {
      drivers: {
        surname: 'asc'
      }
    },
    where: {
      races: {
        year: 2023
      }
    }
  });

  const activeDrivers = activeDriverStandings.map(standing => standing.drivers);
  const activeDriverIds = activeDrivers.map(driver => driver.driverId);

  const inactiveDrivers = await prisma.driver.findMany({
    where: {
      NOT: {
        driverId: {
          in: activeDriverIds
        }
      }
    },
    select: {
      driverId: true,
      driverRef: true,
      surname: true,
      forename: true,
      number: true,
      code: true,
    },
    orderBy: {
      surname: 'asc'
    }
  });


  return json({ inactiveDrivers, activeDrivers });
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

      <main className="flex h-full bg-white ml-4">
        <div className="flex-col">
          <h2 className="text-lg font-bold mt-4">Active Drivers</h2>
          <ul>
            {data.activeDrivers.map(driver => {
              return <li className="my-1 hover:font-bold" key={driver.driverRef}>
                <Link to={driver.driverId.toString()}>
                  <span>{driver.forename} {driver.surname}</span>
                  {driver.code ? <small> {driver.code} </small> : null}
                </Link>
              </li>
            })}
          </ul>
          <details>
            <summary className="text-lg font-bold mt-4">Inactive Drivers</summary>
            <ul>
              {data.inactiveDrivers.map(driver => {
                return <li className="my-1 hover:font-bold" key={driver.driverRef}>
                  <Link to={driver.driverId.toString()}>
                    <span>{driver.forename} {driver.surname}</span>
                    {driver.code ? <small> {driver.code} </small> : null}
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
