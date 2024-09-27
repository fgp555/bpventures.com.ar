"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeOrm_1 = require("./config/typeOrm");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("./modules/users/users.module");
const seed_module_1 = require("./modules/seed/seed.module");
const mail_module_1 = require("./modules/mail/mail.module");
const deliverables_module_1 = require("./modules/deliverables/deliverables.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const vouchers_module_1 = require("./modules/vouchers/vouchers.module");
const companies_module_1 = require("./modules/company/companies.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [companies_module_1.CompaniesModule, auth_module_1.AuthModule, users_module_1.UserModule, seed_module_1.SeedModule, mail_module_1.MailModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [typeOrm_1.default]
            }), typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => config.get('typeorm'),
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
                global: true
            }),
            schedule_1.ScheduleModule.forRoot(),
            deliverables_module_1.DeliverablesModule,
            vouchers_module_1.VouchersModule,
            invoices_module_1.InvoicesModule,
            notifications_module_1.NotificationsModule,],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map