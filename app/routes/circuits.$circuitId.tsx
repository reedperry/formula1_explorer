
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.circuitId, "circuitId not found");
  const circuitId = Number.parseInt(params.circuitId);
  const circuit = await prisma.circuit.findFirst({
    where: { circuitId }
  })

  const circuitWinnerResults = await prisma.result.findMany({
    select: {
      races: {
        select: {
          year: true
        }
      },
      drivers: {
        select: {
          driverId: true,
          forename: true,
          surname: true
        }
      }
    },
    where: {
      positionText: '1',
      races: {
        circuitId
      }
    },
    orderBy: {
      races: {
        year: 'desc'
      }
    }
  });

  const raceWins = circuitWinnerResults.map(result => ({
    driver: result.drivers,
    year: result.races.year
  }));

  if (!circuit) {
    throw new Response("Circuit not found.", { status: 404 })
  }
  return json({ circuit, raceWins });
}

export default function CircuitDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const circuit = data.circuit;
  const lastFiveWinners = data.raceWins.slice(0, 5);
  const olderWinners = data.raceWins.slice(5);

  return (
    <div>
      <h1 className="text-2xl mb-4">{circuit.name} - {circuit.country}</h1>
      <div>
        <a href={circuit.url} target="_blank" referrerPolicy="no-referrer">
          Visit {circuit.name}'s page on Wikipedia
        </a>
      </div>
      <h2 className="font-bold mt-4">Previous Winners</h2>
      <ul>
        {lastFiveWinners.map(win => (
          <li className="my-1"><Link to={`/drivers/${win.driver.driverId}`}>{win.driver.forename} {win.driver.surname}</Link> ({win.year})</li>
        ))}
        {olderWinners.length ? (
          <details><summary>Show More...</summary>
            {olderWinners.map(win => (
              <li className="my-1" key={win.year}><Link to={`/drivers/${win.driver.driverId}`}>{win.driver.forename} {win.driver.surname}</Link> ({win.year})</li>
            ))}
          </details>
        ) : null}
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>Something went wrong: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>That circuit was not found.</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
