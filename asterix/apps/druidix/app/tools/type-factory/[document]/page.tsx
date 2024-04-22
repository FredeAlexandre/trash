import documents from "@asterix/schemas/list";

import { MagicForm } from "./_components/magic-form";

export async function generateStaticParams() {
  return documents.map((document) => ({
    document: document.shape.type.value,
  }))
}

export default function TypeFactoryDocumentPage({
  params,
}: {
  params: { document: string };
}) {
  const document = documents.find(
    (document) => document.shape.type.value === params.document,
  );

  if (!document) return <>The Document was not found</>;

  return (
    <div className="container flex justify-center">
      <MagicForm schema={document} />
    </div>
  );
}
