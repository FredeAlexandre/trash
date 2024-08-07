import Image from "next/image";
import Link from "next/link";

import { UserButton } from "./_components/user-button";
import Logo from "../../../public/logo.svg";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line */}
            <Image src={Logo} alt="UNDERSCORE logo" className="h-8 w-auto" />
          </Link>
          <div className="flex flex-grow justify-end">
            <UserButton />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
