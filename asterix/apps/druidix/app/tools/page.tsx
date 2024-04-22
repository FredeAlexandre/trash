import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@asterix/ui/breadcrumb";
import { Box, Clipboard, Database, History, Sheet, Table } from "lucide-react";

export default function Tools() {
  return (
    <div className="flex flex-col items-center pt-10">
      <div className="container">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tools</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="pt-6 font-mono text-2xl font-bold uppercase">
        Druidix - Tools
      </h1>
      <p className="text-muted-foreground">
        A suit of tools around Drudix which don&apos;t fit in the workspace
        plateform
      </p>
      <div className="container grid grid-cols-4 gap-4 pt-10">
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/excel-extractor"
        >
          <h2 className="font-mono text-sm">
            {" "}
            <Sheet className="inline" /> Excel Data Extractor
          </h2>
          <p className="text-xs text-muted-foreground">
            Let you extract data from excel file and convert it to JSON
          </p>
        </Link>
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/clipboard-extractor"
        >
          <h2 className="font-mono text-sm">
            <Clipboard className="inline" /> Clipboard Data Extractor
          </h2>
          <p className="text-xs text-muted-foreground">
            Copy table from an excel to clipboard and convert it to JSON
          </p>
        </Link>
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/table-comparator"
        >
          <h2 className="font-mono text-sm">
            <Table className="inline" /> Table comparator
          </h2>
          <p className="text-xs text-muted-foreground">
            Import 2 tables and compare them with visual feedback
          </p>
        </Link>
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/cache-manager"
        >
          <h2 className="font-mono text-sm">
            <Database className="inline" /> Cache Manager
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage the data you saved in the cache to get free space or re use
            same names
          </p>
        </Link>
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/type-factory"
        >
          <h2 className="font-mono text-sm">
            <Box className="inline" /> Type Factory
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate data object from UI by type compound
          </p>
        </Link>
        <Link
          className="w-full space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow"
          href="/tools/cid-history"
        >
          <h2 className="font-mono text-sm">
            <History className="inline" /> CID History
          </h2>
          <p className="text-xs text-muted-foreground">
            View the documents in specific baseline and see if there is changes
            when
          </p>
        </Link>
      </div>
    </div>
  );
}
