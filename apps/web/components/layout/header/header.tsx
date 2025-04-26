import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-black p-4 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2 border-b border-white">
        <Link href="/" passHref legacyBehavior>
          <a className="text-2xl font-bold hover:underline focus:outline-none">Conundrum Capital</a>
        </Link>
      </div>
    </header>
  );
}