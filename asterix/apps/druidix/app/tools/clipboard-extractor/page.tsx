import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@asterix/ui/breadcrumb";
import { ScrollArea } from "@asterix/ui/scroll-area";

import { ClipboardExtractor } from "./_components/clipboard-extractor";

export default function ClipboardExtractorPage() {
  return (
    <ScrollArea className="h-screen">
      <div className="container space-y-10 py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Clipboard Extractor</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ClipboardExtractor />
      </div>
    </ScrollArea>
  );
}
