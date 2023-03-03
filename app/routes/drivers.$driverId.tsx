import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { getDriver } from "~/models/driver.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.driverId, "driverId not found");
  const driverId = Number.parseInt(params.driverId);
  const driver = await getDriver(driverId);
  if (!driver) {
    throw new Response('Driver not found.', { status: 404 });
  }

  const polePositions = await prisma.qualifying.count({
    where: {
      driverId,
      position: 1,
    },
  });

  const wins = await prisma.result.count({
    where: {
      driverId,
      positionText: '1'
    }
  });

  return json({ driver, polePositions, wins });
}

export default function DriverDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const driver = data.driver;
  let dob = findDriverDOB(driver.dob);

  return (
    <div>
      <h1 className="text-2xl mb-2">{driver.forename} {driver.surname} {driver.code ? <span>({driver.code})</span> : null}</h1>
      <table className="table-auto mb-2">
        <tbody>
          <tr>

            <td className="p-3 border border-slate-700">Born</td>
            {dob ? (
              <td className="p-3 border border-slate-700">{dob.toLocaleDateString()}</td>
            ) : <td className="p-3 border border-slate-700"></td>}
          </tr>
          {driver.nationality && (<tr>
            <td className="p-3 border border-slate-700">Nationality</td>
            <td className="p-3 border border-slate-700">{ /*<CountryFlag nationality={driver.nationality} /> */}{driver.nationality}</td>
          </tr>)}
          <tr>
            <td className="p-3 border border-slate-700">Pole Positions</td>
            <td className="p-3 border border-slate-700">{data.polePositions}</td>
          </tr>
          <tr>
            <td className="p-3 border border-slate-700">Race Wins</td>
            <td className="p-3 border border-slate-700">{data.wins}</td>
          </tr>
        </tbody>
      </table>
      <a href={driver.url} target="_blank" referrerPolicy="no-referrer">Visit {driver.forename} {driver.surname}'s page on Wikipedia</a>
    </div>
  );
}

function CountryFlag(props: { nationality: string }) {
  return props.nationality ? <img className="h-8" src="/images/..."></img> : null;
}

function findDriverDOB(utcDob: string): Date | null {
  if (utcDob) {
    const [YYYY, MM, DD] = utcDob.split('-');
    return new Date(Number.parseInt(YYYY), Number.parseInt(MM) - 1, Number.parseInt(DD));
  }
  return null;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>Something went wrong: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>That driver was not found.</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
