import { fetchPublishFormById } from "@/actions/form.action";
import React from "react";
import NotAvaliable from "../../_components/NotAvaliable";
import { FormBlockInstance } from "@/@types/form-block.type";
import FormSubmitComponent from "../../_components/FormSubmitComponent";

const Page = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}) => {
  const { formId } = await params;

  const result = await fetchPublishFormById(formId);

  if (!result.success || !result.form) {
    return <NotAvaliable message={result.message} />;
  }

  const { form } = result;

  const blocks = JSON.parse(form.jsonBlocks) as FormBlockInstance[];
  return (
    <FormSubmitComponent
      formId={formId}
      blocks={blocks}
      bannerImage={(form.settings as any)?.bannerImage}
      primaryColor={form.settings.primaryColor}
      backgroundColor={form.settings.backgroundColor}
    />
  );
};

export default Page;
