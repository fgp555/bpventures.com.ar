"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const singIn_dto_1 = require("./dtos/singIn.dto");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const signup_dto_1 = require("./dtos/signup.dto");
const auth_guards_1 = require("../../guards/auth.guards");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async checkEmailExists(email) {
        try {
            const exists = await this.authService.checkEmailExists(email);
            return { exists };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async signIn(Crendential) {
        const { email, password, mfa } = Crendential;
        try {
            if (!email || !password)
                throw new common_1.BadRequestException('No credentials provided!');
            const result = await this.authService.signIn(email, password);
            if (!result) {
                throw new common_1.BadRequestException('Invalid credentials!');
            }
            if (result.mfaEnabled) {
                if (!mfa)
                    throw new common_1.BadRequestException('Two factor code is required!');
                const isValidate = this.authService.validateMfa(mfa, result.mfaSecret);
                if (!isValidate)
                    throw new common_1.BadRequestException('Invalid MFA code!');
            }
            const userPayload = {
                id: result.id,
                sub: result.id,
                email: result.email,
                isAdmin: result.isAdmin,
                names: result.Names,
                lastName: result.LastName,
            };
            const token = this.jwtService.sign(userPayload);
            return { message: 'You are authenticated!', token, userPayload };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async signUp(body) {
        try {
            return await this.authService.signUpService(body);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async resetPassword(token, newPassword) {
        await this.authService.resetPassword(token, newPassword);
        return { message: 'Password has been reset successfully' };
    }
    async verifyToken(req) {
        try {
            const user = req.user;
            if (!user)
                throw new common_1.ForbiddenException('No user found!');
            return { message: 'Token verified!', user };
        }
        catch (error) {
            throw new common_1.ForbiddenException(error);
        }
    }
    async enableMfa(req) {
        try {
            const user = req.user;
            if (!user)
                throw new common_1.BadRequestException('No user found!');
            const secret = await this.authService.generateMfaSecret(user.email, user.id);
            const qrCode = await this.authService.generateMfaQrCode(secret);
            return { message: 'MFA enabled!', qrCode, secret: secret.base32 };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async forgotPassword(body) {
        const { email, domain } = body;
        try {
            await this.authService.forgotMyPassword(email, domain);
            return { message: 'Password reset link has been sent to your email!' };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('check-email'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmailExists", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [singIn_dto_1.SingInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('verifyToken'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Post)('enable-mfa'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map