"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_seeder_1 = require("./modules/seed/user-seeder");
const deliverable_seeder_1 = require("./modules/seed/deliverable.seeder");
const deliverableType_seeder_1 = require("./modules/seed/deliverableType.seeder");
const invoiceStatus_seeder_1 = require("./modules/seed/invoiceStatus.seeder");
const permissionType_seeder_1 = require("./modules/seed/permissionType.seeder");
const swagger_1 = require("@nestjs/swagger");
const deliverableCategory_seeder_1 = require("./modules/seed/deliverableCategory.seeder");
const fs = require("fs");
const permission_seeder_1 = require("./modules/seed/permission.seeder");
const morgan = require("morgan");
const path_1 = require("path");
const company_seeder_1 = require("./modules/seed/company-seeder");
const invoices_seeder_1 = require("./modules/seed/invoices-seeder");
const notificationType_seeder_1 = require("./modules/seed/notificationType.seeder");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.use(morgan('dev'));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization, Content-Disposition',
        exposedHeaders: 'Content-Disposition'
    });
    const companySeeder = app.get(company_seeder_1.CompanySeeder);
    await companySeeder.seed();
    const userSeeder = app.get(user_seeder_1.UserSeeder);
    await userSeeder.seed();
    const deliverableTypeSeeder = app.get(deliverableType_seeder_1.DeliverableTypeSeeder);
    await deliverableTypeSeeder.seedDeliverableType();
    const deliverableCategorySeeder = app.get(deliverableCategory_seeder_1.DeliverableCategorySeeder);
    await deliverableCategorySeeder.seedDeliverableCategory();
    const invoiceStatusSeeder = app.get(invoiceStatus_seeder_1.InvoiceStatusSeeder);
    await invoiceStatusSeeder.seedInvoiceStatus();
    const permissionTypeSeeder = app.get(permissionType_seeder_1.PermissionTypeSeeder);
    await permissionTypeSeeder.seedPermissionType();
    const deliverableSeeder = app.get(deliverable_seeder_1.DeliverableSeeder);
    await deliverableSeeder.seedDeliverable();
    const permissionSeeder = app.get(permission_seeder_1.PermissionSeeder);
    await permissionSeeder.seedPermission();
    const invoiceSeeder = app.get(invoices_seeder_1.InvoiceSeeder);
    await invoiceSeeder.seed();
    const notificationSeeder = app.get(notificationType_seeder_1.NotificationTypeSeeder);
    await notificationSeeder.seedNotificationType();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BP Ventures API')
        .setDescription('Endpoints de BP Ventures')
        .setVersion('1.0')
        .addServer('https://api.1rodemayo.com')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map