import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import Sidebar from '~/components/Sidebar';
import { prisma } from '~/db.server';

export async function loader({ request }: LoaderArgs) {
  const activeConstructorsStandings = await prisma.constructorStanding.findMany(
    {
      distinct: ['constructorId'],
      select: {
        constructors: {
          select: {
            constructorId: true,
            name: true,
          },
        },
      },
      where: {
        races: {
          year: 2023,
        },
      },
    }
  );

  const activeConstructors = activeConstructorsStandings.map(
    result => result.constructors
  );
  const activeConstructorIds = activeConstructors.map(ctr => ctr.constructorId);

  const inactiveConstructors = await prisma.constructor.findMany({
    where: {
      NOT: {
        constructorId: {
          in: activeConstructorIds,
        },
      },
    },
    select: {
      constructorId: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return json({ inactiveConstructors, activeConstructors });
}

export default function ConstructorsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full min-h-screen w-full flex-col">
      <header className="flex w-full items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-2xl">
          <Link to=".">Constructors</Link>
        </h1>
      </header>

      <main className="ml-4 flex h-full bg-white">
        <Sidebar>
          <div className="flex-col">
            <h2 className="mt-4 text-lg font-bold">Active Constructors</h2>
            <ul>
              {data.activeConstructors.map(constructor => {
                return (
                  <li className="my-1 hover:font-bold" key={constructor.name}>
                    <NavLink
                      to={constructor.constructorId.toString()}
                      className={({ isActive }) =>
                        isActive ? 'font-bold' : undefined
                      }
                    >
                      <span>{constructor.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            <details>
              <summary className="mt-4 text-lg font-bold">
                Inactive Constructors
              </summary>
              <ul>
                {data.inactiveConstructors.map(constructor => {
                  return (
                    <li className="my-1 hover:font-bold" key={constructor.name}>
                      <NavLink
                        to={constructor.constructorId.toString()}
                        className={({ isActive }) =>
                          isActive ? 'font-bold' : undefined
                        }
                      >
                        <span>{constructor.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </details>
          </div>
        </Sidebar>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
