import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const constructors = await prisma.constructor.findMany({
    select: {
      constructorId: true,
      name: true,
    },
    orderBy: {
      name: 'asc'
    },
  });

  return json({ constructors });
}

export default function ConstructorsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full min-h-screen flex-col max-w-screen-lg">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Constructors</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white">
        <ul>
          {data.constructors.map(constructor => {
            return <li key={constructor.name}>
              <Link to={constructor.constructorId.toString()}>
                <span>{constructor.name}</span>
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
