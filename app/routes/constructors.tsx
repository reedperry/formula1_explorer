import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const activeConstructorsStandings = await prisma.constructorStanding.findMany({
    distinct: ['constructorId'],
    select: {
      constructors: {
        select: {
          constructorId: true,
          name: true,
        }
      }
    },
    where: {
      races: {
        year: 2023
      }
    }
  });

  const activeConstructors = activeConstructorsStandings.map(result => result.constructors);
  const activeConstructorIds = activeConstructors.map(ctr => ctr.constructorId);

  const inactiveConstructors = await prisma.constructor.findMany({
    where: {
      NOT: {
        constructorId: {
          in: activeConstructorIds
        }
      }
    },
    select: {
      constructorId: true,
      name: true,
    },
    orderBy: {
      name: 'asc'
    },
  });


  return json({ inactiveConstructors, activeConstructors });
}

export default function ConstructorsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full w-full min-h-screen flex-col max-w-screen-lg">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Constructors</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white ml-4">
        <div className="flex-col">
          <h2 className="text-lg font-bold mt-4">Active Constructors</h2>
          <ul>
            {data.activeConstructors.map(constructor => {
              return <li className="my-1 hover:font-bold" key={constructor.name}>
                <Link to={constructor.constructorId.toString()}>
                  <span>{constructor.name}</span>
                </Link>
              </li>
            })}
          </ul>
          <details><summary className="text-lg font-bold mt-4">Inactive Constructors</summary>
            <ul>
              {data.inactiveConstructors.map(constructor => {
                return <li className="my-1 hover:font-bold" key={constructor.name}>
                  <Link to={constructor.constructorId.toString()}>
                    <span>{constructor.name}</span>
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
