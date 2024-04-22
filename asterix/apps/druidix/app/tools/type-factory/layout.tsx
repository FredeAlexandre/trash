import documents from "@asterix/schemas/list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@asterix/ui/breadcrumb";

import { SelectRoute } from "./_components/select-route";

export default function TypeFactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container pt-10">
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
              <BreadcrumbPage>Type Factory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="h-10" />
        <div className="flex justify-center">
          <SelectRoute
            routes={documents.map((document) => document.shape.type.value)}
          />
        </div>
      </div>
      <div className="h-5" />
      <hr />
      <div className="pb-20 pt-5">{children}</div>
    </>
  );
}
