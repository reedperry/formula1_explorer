
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.circuitId, "circuitId not found");
  const circuitId = Number.parseInt(params.circuitId);
  const circuit = await prisma.circuit.findFirst({ where: { circuitId } })
  if (!circuit) {
    throw new Response("Circuit not found.", { status: 404 })
  }
  return json({ circuit });
}

export default function CircuitDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const circuit = data.circuit;

  return (
    <div>
      <h1>{circuit.name} - {circuit.country}</h1>
      <div>
        <a href={circuit.url} target="_blank" referrerPolicy="no-referrer">Wikipedia</a>
      </div>
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
