/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export interface Deliverable {
  id: number;
  invoicePath: string;
  invoiceNumber: string;
  invoiceIssueDate: string;
  invoiceDueDate: string;
  invoiceAmount: string;
  invoiceStatus: string;
  overdueIndicator: boolean;
}

const invoiceWidget = () => {
  const [allInvoices, setAllInvoices] = useState<Deliverable[]>([]);

  const { userData } = useAuth();

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/${userData?.id}`
        );
        const data = await response.json();
        
        setAllInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchDeliverables();
  }, [userData?.id]);

  return (
    <div className=" p-6 font-futura">
      <h1 className="text-4xl font-futura mb-6 text-secundary">
        Facturas Pendientes
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-secundary font-sans text-white">
            <tr>
              <th className="py-3 px-6  text-left text-lg">Factura</th>
              <th className="py-3 px-6 font-sans text-left text-lg">Monto</th>
              <th className="py-3 px-6 font-sans text-left text-lg">Estado</th>
              <th className="py-3 px-6 font-sans text-left text-lg">Emisión</th>
              <th className="py-3 px-6 font-sans text-left text-lg">
                Vencimiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-4 px-6 font-sans text-sm text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="py-4 px-6 font-sans text-sm text-gray-700">
                  ${invoice.invoiceAmount}
                </td>
                <td className="py-4 px-6 font-sans text-sm text-gray-700">
                  {invoice.invoiceStatus}
                </td>
                <td className="py-4 px-6 font-sans text-sm text-gray-700">
                  {invoice.invoiceIssueDate}
                </td>
                <td className="py-4 px-6 font-sans text-sm text-gray-700">
                  {invoice.invoiceDueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allInvoices.length === 0 && (
          <p className="p-6 text-gray-600">
            No se encontraron facturas pendientes.
          </p>
        )}
      </div>
    </div>
  );
};

export default invoiceWidget;
