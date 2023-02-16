import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.driverId, "driverId not found");
  return json({ });
}

export default function DriverDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      Driver Details
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Driver not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
