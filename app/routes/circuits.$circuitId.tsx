import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import {
  alignCountryName,
  getCountryCodeForCountryName,
} from '~/helpers/country-mapping';

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.circuitId, 'circuitId not found');
  const circuitId = Number.parseInt(params.circuitId);
  const circuit = await prisma.circuit.findFirst({
    where: { circuitId },
  });
  if (!circuit) {
    throw new Response('Circuit not found.', { status: 404 });
  }

  circuit.country = alignCountryName(circuit.country);
  const countryCode = getCountryCodeForCountryName(circuit.country);

  const circuitWinnerResults = await prisma.result.findMany({
    select: {
      races: {
        select: {
          year: true,
        },
      },
      drivers: {
        select: {
          driverId: true,
          forename: true,
          surname: true,
        },
      },
    },
    where: {
      positionText: '1',
      races: {
        circuitId,
      },
    },
    orderBy: {
      races: {
        year: 'desc',
      },
    },
  });

  const raceWins = circuitWinnerResults.map(result => ({
    driver: result.drivers,
    year: result.races.year,
  }));

  return json({ circuit, raceWins, countryCode });
}

export default function CircuitDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const circuit = data.circuit;
  const lastFiveWinners = data.raceWins.slice(0, 5);
  const olderWinners = data.raceWins.slice(5);

  return (
    <div>
      <h1 className="mb-4 text-2xl">{circuit.name}</h1>
      <h2 className="mb-3 text-xl">
        {circuit.location}, {circuit.country}
        <CountryFlag countryCode={data.countryCode} />
      </h2>
      <div>
        <a href={circuit.url} target="_blank" referrerPolicy="no-referrer">
          Visit {circuit.name}'s page on Wikipedia
        </a>
      </div>
      <h2 className="mt-4 font-bold">Previous Winners</h2>
      <ul>
        {lastFiveWinners.map(win => (
          <li className="my-1" key={win.year}>
            <Link to={`/drivers/${win.driver.driverId}`}>
              {win.driver.forename} {win.driver.surname}
            </Link>{' '}
            ({win.year})
          </li>
        ))}
        {olderWinners.length ? (
          <details>
            <summary>Show More...</summary>
            {olderWinners.map(win => (
              <li className="my-1" key={win.year}>
                <Link to={`/drivers/${win.driver.driverId}`}>
                  {win.driver.forename} {win.driver.surname}
                </Link>{' '}
                ({win.year})
              </li>
            ))}
          </details>
        ) : null}
      </ul>
    </div>
  );
}

function CountryFlag(props: { countryCode: string }) {
  return props.countryCode ? (
    <img
      className="ml-4 inline h-10 shadow"
      src={`/images/flags/${props.countryCode}.png`}
    ></img>
  ) : null;
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
