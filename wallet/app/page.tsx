import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreditCard, BarChart2 } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="p-4 flex gap-2">
        <Avatar className="size-9">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Input className="rounded-full" placeholder="Search" />
        <Button size="icon" variant="outline" className="shrink-0 rounded-full">
          <BarChart2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="shrink-0 rounded-full">
          <CreditCard className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-6 mt-10">
        <div className="flex flex-col items-center gap-2">
          <div className="space-x-0.5 text-xs">
            <div className="inline">Main</div>
            <div className="inline">&middot;</div>
            <div className="inline">EUR</div>
          </div>
          <div className="text-4xl font-bold">€12,67</div>
        </div>
        <Button variant="outline" className="rounded-full">
          Accounts
        </Button>
      </div>
    </>
  );
}
