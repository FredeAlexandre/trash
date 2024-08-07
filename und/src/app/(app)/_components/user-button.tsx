"use client";

import { LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import * as React from "react";

import { Discord } from "~/components/icons/discord";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const DropdownMenuContentAsNotAuth = () => {
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuItem onClick={() => signIn("discord")}>
        <Discord className="mr-2 h-4 w-4 fill-white" />
        <span>Connect</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const DropdownMenuContentAsAuth = () => {
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={async () => {
          await signOut();
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const UserImage = () => {
  const { data } = useSession();

  if (!data?.user.image) return <User className="h-4 w-4" />;

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={data.user.image} />
      <AvatarFallback>{data.user.name}</AvatarFallback>
    </Avatar>
  );
};

export const UserButton = () => {
  const { status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 w-10 rounded-full">
          {status === "authenticated" ? <UserImage /> : <User />}
        </Button>
      </DropdownMenuTrigger>
      {status === "authenticated" ? (
        <DropdownMenuContentAsAuth />
      ) : (
        <DropdownMenuContentAsNotAuth />
      )}
    </DropdownMenu>
  );
};
