import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.driverId, "driverId not found");
  const driverId = Number.parseInt(params.driverId);
  const driver = await prisma.driver.findFirst({ where: { driverId } })
  if (!driver) {
    throw new Response("Driver not found.", { status: 404 })
  }

  const polePositions = await prisma.qualifying.count({
    where: {
      driverId,
      position: 1,
    },
  });

  return json({ driver, polePositions });
}

export default function DriverDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const driver = data.driver;
  let dob = findDriverDOB(driver.dob);

  return (
    <div>
      <h1>{driver.forename} {driver.surname}</h1>
      <dl>
        <dt>DOB</dt>
        {dob ? (
          <dd>{dob.toLocaleDateString()}</dd>
        ) : <dd></dd>}
        <dt>Wikipedia</dt>
        <dd><a href={driver.url} target="_blank" referrerPolicy="no-referrer">{driver.url}</a></dd>
        <dt>Pole Positions</dt>
        <dd>{data.polePositions}</dd>
      </dl>
      <div>
        <pre>
          {JSON.stringify(data.driver, null, 2)}
        </pre>
      </div>
    </div>
  );
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
