import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
  Delete,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs-extra';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guards';
import { Request } from 'express';
import { Permission } from 'src/entities/permission.entity';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getAllInvoices() {
    return this.invoicesService.getAllInvoices();
  }

  // =====================================
  @UseGuards(AuthGuard)
  @Patch('status/:id')
  async updateInvoiceStatus(
    @Param('id') id: number,
    @Body() updateInvoiceStatusDto: UpdateInvoiceStatusDto,
    @Req() req: Request,
  ) {
    try {
      const user =  req.user.id;
      console.log(updateInvoiceStatusDto);
      
      return this.invoicesService.updateInvoiceStatus(id, updateInvoiceStatusDto,user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // =====================================
  @Get('check-invoice-number')
  async checkInvoiceNumber(
    @Query('invoiceNumber') invoiceNumber: string,
  ): Promise<{ exists: boolean }> {
    try {
      const exists =
        await this.invoicesService.checkInvoiceNumberExists(invoiceNumber);
      return { exists };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':userId')
  async getInvoicesByUser(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const idsInvoiceStatus = [1, 2, 3];
      return this.invoicesService.getInvoicesByUser(
        userId,
        idsInvoiceStatus,
        page,
        limit,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/invoices';
          await fs.ensureDir(uploadPath); // Crea el directorio si no existe
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createInvoice(
    @UploadedFile() file: Express.Multer.File,
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() req: Request,
  ) {
    try {
      const userId= req.user.id;
      // Asigna el path del archivo al DTO
      createInvoiceDto.path = file ? file.path : null;
      return this.invoicesService.createInvoice(createInvoiceDto, userId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':invoiceId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/invoices';
          await fs.ensureDir(uploadPath); // Crea el directorio si no existe
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateInvoice(
    @Param('invoiceId') invoiceId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ) {
    try {
      // Asigna el path del archivo al DTO solo si el archivo es nuevo
      updateInvoiceDto.path = file ? file.path : undefined;
      return this.invoicesService.updateInvoice(invoiceId, updateInvoiceDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('getbyid/:id')
  async getInvoiceById(@Param('id') id: number) {
    try {
      return await this.invoicesService.getInvoiceById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('user/:id')
  async getInvoice(@Param('id') id: number) {
    try {
      return await this.invoicesService.getInvoicesById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('download/:invoiceId')
  async getDonwloadInvoicesCopy(
    @Param('userId') userId: number,
    @Param('invoiceId') invoiceId: number,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      const userId =req.user.id;
      const data = await this.invoicesService.getDonwloadInvoicesCopy(
        userId,
        invoiceId,
        res,
      );
      const { filePath, invoiceCopy, contentType,fileExtension } = data;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${invoiceCopy.number}.${fileExtension}"`);
      res.download(filePath);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Delete(':invoiceId')
  @UseGuards(AuthGuard)
  async deleteInvoice(
    @Param('invoiceId') invoiceId: number,
    @Req() req: Request,
  ) {
    try {
      const isAdmin = req.user.isAdmin;

      if (!isAdmin) {
        throw new ForbiddenException(
          'No tiene permisos para realizar esta acción',
        );
      }
      await this.invoicesService.deleteInvoice(invoiceId);
      return { message: 'deleted' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('permision/:invoiceId')
  async getPermision(
    @Param('invoiceId') invoiceId: number,
  ) {
    try {
      return this.invoicesService.getPermissions(invoiceId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('permision/:invoiceId')
  async createPermision(
    @Param('invoiceId') invoiceId: number,
    @Body() permission: any,
    @Req() req: Request
  ): Promise<Permission[]> {
    try {
      const userId = req.user.id;
      return this.invoicesService.updatePermissions(
        invoiceId,
        permission,
        userId
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

    // Endpoint para enviar correos de facturas próximas a vencerse
    @Post('notify-due-soon')
    async notifyDueSoonInvoices(): Promise<void> {
      await this.invoicesService.sendDueSoonEmails();
    }
}
