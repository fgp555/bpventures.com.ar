"use client";
import BackButton from "@/components/Buttons/BackButton";
import BackButtonString from "@/components/Buttons/BackButtonString";
import UpdateInvoiceComponent from "@/components/invoice/UpdateInvoiceComponent";
import React from "react";

interface IdParams {
  params: {
    id: number;
  };
}
export const UploadInvoices: React.FC<IdParams> = ({ params }) => {
  return (
    <div className="container mx-auto py-6 w-4/5 font-futura">
    <BackButtonString hrefString="/in/invoices/list" />
    <UpdateInvoiceComponent invoiceId={params.id} />
  </div>
  );
};

export default UploadInvoices;
