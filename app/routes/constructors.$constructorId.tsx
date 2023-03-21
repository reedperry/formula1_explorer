import { json, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';

// TODO Add drivers for team

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.constructorId, 'constructorId not found');
  const constructorId = Number.parseInt(params.constructorId);
  const constructor = await prisma.constructor.findFirst({
    where: { constructorId },
  });

  const standings = await prisma.constructorStanding.findMany({
    take: 1,
    orderBy: {
      races: {
        date: 'desc',
      },
    },
    where: {
      constructorId,
      races: {
        year: 2022,
      },
    },
  });
  if (!constructor) {
    throw new Response('Constructor not found.', { status: 404 });
  }

  return json({ constructorDetail: constructor, standings });
}

export default function ConstructorDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const constructor = data.constructorDetail;
  const finalStanding2022 = data.standings[0];

  return (
    <div>
      <h1 className="mb-4 text-2xl">{constructor.name}</h1>
      {finalStanding2022 ? (
        <p>
          2022 Constructor's Championship Standing:{' '}
          {finalStanding2022.positionText} ({finalStanding2022.points} points)
        </p>
      ) : null}
      <div>
        <a href={constructor.url} target="_blank" referrerPolicy="no-referrer">
          Visit {constructor.name}'s page on Wikipedia
        </a>
      </div>
    </div>
  );
}
