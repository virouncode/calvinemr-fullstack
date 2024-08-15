import React, { useRef, useState } from "react";
import { useBillingCodesTemplates } from "../../../../hooks/reactquery/queries/billingCodesTemplatesQueries";
import useIntersection from "../../../../hooks/useIntersection";
import Button from "../../../UI/Buttons/Button";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import BillingCodesTemplateForm from "./BillingCodesTemplateForm";
import BillingCodesTemplateItem from "./BillingCodesTemplateItem";

type BillingCodesTemplatesProps = {
  handleSelectTemplate: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    billing_codes: string[]
  ) => void;
};

const BillingCodesTemplates = ({
  handleSelectTemplate,
}: BillingCodesTemplatesProps) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useBillingCodesTemplates(search);

  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const billingCodesTemplatesStartRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleAddNew = () => {
    setNewTemplateVisible((v) => !v);
    billingCodesTemplatesStartRef.current &&
      billingCodesTemplatesStartRef.current.scrollIntoView();
  };

  if (error) {
    return (
      <div className="billing-codes__templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const templates = data?.pages.flatMap((page) => page.items);

  return (
    <div className="billing-codes__templates">
      <div className="billing-codes__templates-btn-container">
        <Button
          onClick={handleAddNew}
          disabled={newTemplateVisible}
          label="Add a new template"
        />
      </div>
      <div className="billing-codes__templates-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          width={300}
          placeholder="Template name, author name..."
          autoFocus={true}
        />
      </div>
      {errMsgPost && (
        <p className="billing-codes__templates-err">{errMsgPost}</p>
      )}
      <div className="billing-codes__templates-list" ref={divRef}>
        <div ref={billingCodesTemplatesStartRef}></div>
        <ul>
          {newTemplateVisible && (
            <BillingCodesTemplateForm
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              setNewTemplateVisible={setNewTemplateVisible}
            />
          )}
          {templates && templates.length > 0
            ? templates.map((template, index) =>
                index === templates.length - 1 ? (
                  <BillingCodesTemplateItem
                    template={template}
                    handleSelectTemplate={handleSelectTemplate}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    key={template.id}
                    lastItemRef={lastItemRef}
                  />
                ) : (
                  <BillingCodesTemplateItem
                    template={template}
                    handleSelectTemplate={handleSelectTemplate}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    key={template.id}
                  />
                )
              )
            : !isFetchingNextPage &&
              !isPending && <EmptyLi text="No results found" />}
          {(isFetchingNextPage || isPending) && <LoadingLi />}
        </ul>
      </div>
    </div>
  );
};

export default BillingCodesTemplates;
