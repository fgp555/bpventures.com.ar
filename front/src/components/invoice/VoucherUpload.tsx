import React, { useEffect, useState } from "react";
import "../../styles/form-style.css";
import Button from "../FormComponent/Button";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

interface InvoiceDetailProps {
  Invoice: InvoiceInterface;
  fetchInvoices?: () => void; // Add this line
}

  // Función para formatear la fecha en formato YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Añade 0 si el mes tiene un solo dígito
    const day = (`0${date.getDate()}`).slice(-2); // Añade 0 si el día tiene un solo dígito
    return `${year}-${month}-${day}`;
  };
  
export const VoucherUpload: React.FC<InvoiceDetailProps> = ({ Invoice, fetchInvoices }) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<string>(formatDate(new Date())); // Fecha de hoy como valor inicial
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [voucherState, setVoucherState] = useState<any>(null);
  const token = Cookies.get("token");

  const getVoucherById = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/${Invoice?.voucher?.id}`);
    if (response.ok) {
      const data = await response.json();
      console.log("data",data)
      console.log("Invoice",Invoice)
      setVoucherState(data);
      // fetchInvoices
      fetchInvoices && fetchInvoices();
    }
  };

  useEffect(() => {
    getVoucherById();
    fetchInvoices && fetchInvoices();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const updateInvoiceStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/status/${Invoice?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invoiceStatusId: 2 }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Estado de la factura actualizado a 'Revisión'",
          confirmButtonColor: "#2b4168",
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Error al actualizar el estado de la factura",
          confirmButtonColor: "#2b4168",
        });
      }
    } catch (error: any) {
      console.error("Error al actualizar el estado de la factura", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#2b4168",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("number", invoiceNumber);
    formData.append("paymentDate", paymentDate);
    formData.append("amount", amount.toString());
    formData.append("invoiceId", Invoice.id.toString());
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Comprobante de pago cargado correctamente",
          confirmButtonColor: "#2b4168",
        });
        setVoucherState(result);
        await updateInvoiceStatus(); // Actualiza el estado de la factura a "Revisión"
        fetchInvoices && fetchInvoices();
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Error al cargar el comprobante de pago",
          confirmButtonColor: "#2b4168",
        });
      }
    } catch (error: any) {
      console.error("Error al cargar el comprobante de pago", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#2b4168",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/${voucherState.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Comprobante de pago eliminado correctamente",
          confirmButtonColor: "#2b4168",
        });
        setVoucherState(null); // Reinicia el estado para mostrar el formulario de carga nuevamente
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Error al eliminar el comprobante de pago",
          confirmButtonColor: "#2b4168",
        });
      }
    } catch (error: any) {
      console.error("Error al eliminar el comprobante de pago", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#2b4168",
      });
    }
  };

  const renderVoucherFile = () => {
    if (!voucherState?.path) {
      return <p>No hay archivo asociado.</p>;
    }

    const fileExtension = voucherState.path.split(".").pop()?.toLowerCase();
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${voucherState.path}`;

    if (fileExtension === "pdf") {
      return (
        <div className="mb-4">
          {/* <pre>{JSON.stringify(Invoice, null, 2)}</pre> */}

          <strong>Archivo Comprobante:</strong>
          <iframe src={fileUrl} title="Comprobante PDF" className="w-full h-96 border-0" />
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-secundary underline mt-2 block">
            Ver PDF en Nueva Ventana
          </a>
        </div>
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <div className="mb-4">
          {/* <pre>{JSON.stringify(Invoice, null, 2)}</pre> */}
          <strong>Previsualización de Comprobante:</strong>
          <img src={fileUrl} alt="Comprobante de Pago" className="mt-2 max-w-xs" />
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-secundary underline mt-2 block">
            Ver Imagen en Nueva Ventana
          </a>
        </div>
      );
    } else {
      return (
        <div className="mb-4">
          {/* <pre>{JSON.stringify(Invoice, null, 2)}</pre> */}

          <strong>Archivo Comprobante:</strong>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-secundary underline mt-2 block">
            Descargar archivo
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {/* <pre>{JSON.stringify(voucherState, null, 2)}</pre> */}
      {voucherState ? (
        <div className="voucher-detail-container mt-8 p-4 border rounded shadow">
          {/* <pre>{JSON.stringify(Invoice?.invoiceStatus?.name, null, 2)}</pre> */}

          <h2 className="text-center text-[1.2rem] mb-4">Detalle del Comprobante de Pago</h2>
          <div className="mb-2">
            <strong>Número de Comprobante:</strong> {voucherState.number}
          </div>
          <div className="mb-2">
            <strong>Fecha de Pago:</strong> {voucherState.paymentDate}
          </div>
          <div className="mb-2">
            <strong>Monto Pagado:</strong> {voucherState.amount}
          </div>
          <div className="mb-2">
            <strong>Factura Asociada:</strong> {voucherState.invoiceId.number}
          </div>
          {renderVoucherFile()}
          {Invoice?.invoiceStatus?.name === "Revisión" && (
            <Button onClick={handleDelete} type="button" className="mt-4 bg-red-500 hover:bg-red-600 text-white">
              Eliminar Comprobante
            </Button>
          )}
          {/* <Button onClick={handleDelete} type="button"
           className="mt-4 bg-red-500 hover:bg-red-600 text-white">
            Eliminar Comprobante
          </Button> */}
        </div>
      ) : (
        <>
          {Invoice?.invoiceStatus?.name === "Pendiente" ? (
            <form className="form-apply" onSubmit={handleSubmit}>
              {/* <pre>{JSON.stringify(token, null, 2)}</pre> */}

              <h1 className="text-center text-[1.2rem] mb-6">Cargar Comprobante de Pago</h1>
              <div className="mb-4">
                <label className="label-apply">Número de Comprobante:</label>
                <input type="text" id="numeroFactura" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="input-apply" required />
              </div>

              <div className="mb-4">
                <label className="label-apply">Fecha de Pago:</label>
                <input type="date" id="fechaPago" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="input-apply" required />
              </div>

              <div className="mb-4">
                <label className="label-apply">Monto Pagado:</label>
                <input type="number" id="montoPagado" value={Invoice.amount} onChange={(e) => setAmount(parseFloat(e.target.value))} className="input-apply" required />
              </div>

              <div className="mb-4">
                <label className="label-apply">Cargar Comprobante:</label>
                <input
                  type="file"
                  id="cargarComprobante"
                  // accept="image/*,application/pdf" // Limita la selección a imágenes y PDF
                  accept=".jpg,.jpeg,.png,application/pdf" // Limita la selección a archivos JPG, PNG y PDF
                  onChange={handleFileChange}
                  className="input-apply"
                  required
                />
              </div>

              <Button type="submit">Guardar Comprobante</Button>
            </form>
          ) : (
            <>
            {Invoice?.invoiceStatus?.name === "Pagado" ? (<>
              <div className="flex items-center justify-center h-[80vh]">
                <h1 className="text-center text-[1.2rem] ">Factura Pagada correctamente</h1>
              </div>            
            </>): (<>
              <div className="flex items-center justify-center h-[80vh]">
                <h1 className="text-center text-[1.2rem] ">Esta Factura a sido anulada</h1>
              </div>
            </>)}
              </>
          )}
        </>
      )}
    </div>
  );
};

export default VoucherUpload;
