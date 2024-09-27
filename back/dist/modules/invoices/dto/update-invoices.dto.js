"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvoiceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_invoices_dto_1 = require("./create-invoices.dto");
class UpdateInvoiceDto extends (0, mapped_types_1.PartialType)(create_invoices_dto_1.CreateInvoiceDto) {
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
//# sourceMappingURL=update-invoices.dto.js.map