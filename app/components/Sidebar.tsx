import { Link } from '@remix-run/react';
import { PropsWithChildren } from 'react';

export default function Sidebar(props: PropsWithChildren<{}>) {
  return (
    <div
      className={`sticky h-full w-72 overflow-y-auto overflow-x-hidden border-r-4 p-3`}
    >
      {props.children}
    </div>
  );
}
