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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const hash_1 = require("../../utils/hash");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const mail_service_1 = require("../mail/mail.service");
const company_entity_1 = require("../../entities/company.entity");
let AuthService = class AuthService {
    constructor(userRepository, companyRepository, mailService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.mailService = mailService;
    }
    async checkEmailExists(email) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        return !!user;
    }
    async signIn(email, password) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user)
            throw new common_1.BadRequestException('Verification Failed');
        if (user.statusId === 1) {
            const validPassword = await (0, hash_1.isValidPassword)(password, user.password);
            if (!validPassword)
                throw new common_1.BadRequestException('Verification Failed');
            return user;
        }
        else {
            throw new common_1.BadRequestException('Usuario inactivo');
        }
    }
    async signUpService(body) {
        console.log('body', body);
        const userExists = await this.userRepository.findOne({
            where: { email: body.email },
        });
        if (userExists)
            throw new common_1.BadRequestException('Usuario ya existe');
        let company = null;
        if (body.companyId) {
            company = await this.companyRepository.findOne({ where: { id: body.companyId } });
            if (!company) {
                throw new common_1.BadRequestException('Company not found');
            }
        }
        const plainPassword = body.password;
        const hashedPassword = await (0, hash_1.hashPassword)(body.password);
        body.password = hashedPassword;
        const user = this.userRepository.create({
            ...body,
            company: company,
        });
        const userSave = await this.userRepository.save(user);
        function encryptToHex(text, key) {
            let encryptedHex = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                encryptedHex += charCode.toString(16).padStart(2, '0');
            }
            return encryptedHex;
        }
        const encryptedHexMessage = encryptToHex(body.email, 'secretkey');
        const resetLink = `${body.domain}/forgotPassword/${encryptedHexMessage}`;
        const logoUrl = 'https://i.postimg.cc/BZ5YWZCk/bpventures-logo.png';
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <img src="${logoUrl}" alt="BP Ventures" style="max-width: 600px; margin-top: 20px;">
        <h1>Registro Exitoso!</h1>
        <p>Hola ${body.Names},</p>
        <p>¡Gracias por registrarte en <strong>BP Ventures</strong>! A continuación, encontrarás tus datos de inicio de sesión:</p>
        <p>
        <strong>Web:</strong> ${body.domain}<br><br>
         <strong>Email:</strong> ${body.email}<br>
         <strong>Contraseña:</strong> ${plainPassword}<br>
        </p>
        <p>Puedes restablecer tu contraseña utilizando el siguiente enlace:</p>
        
        <a href="${resetLink}"
        style="font-family: 'Futura', sans-serif; background-color: #2b4168; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 9999px; width: 100%; outline: none; box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0); cursor: pointer; max-width: 20em; text-decoration: none; font-size: 1em; text-align: center; display: inline-block;"
        onmouseover="this.style.backgroundColor='#1e2a44'"
        onmouseout="this.style.backgroundColor='#2b4168'"
        onfocus="this.style.boxShadow='0 0 0 0.2rem rgba(43, 65, 104, 0.5)'"
        onblur="this.style.boxShadow='0 0 0 0.2rem rgba(255, 255, 255, 0)'"
        >
        Restablecer Contraseña
        </a>
  
        <p>¡Bienvenido a nuestro equipo!</p>
        <p>Saludos cordiales,<br>Equipo de BP Ventures</p>
      </div>
    `;
        const textContent = `
      Hola ${body.Names},
  
      ¡Gracias por registrarte en BP Ventures! A continuación, te proporcionamos tus datos de acceso:
  
      Correo electrónico: ${body.email}
      Contraseña: ${plainPassword}
  
      Puedes restablecer tu contraseña utilizando el siguiente enlace:
      ${resetLink}
  
      Saludos cordiales,
      Equipo de BP Ventures
    `;
        await this.mailService.sendMail(body.email, 'Bienvenido a BP Ventures - Sus datos de inicio de sesión', textContent, htmlContent);
        return { userSave, encryptedHexMessage };
    }
    async forgotMyPassword(email, domain) {
        try {
            const userExists = await this.userRepository.findOne({
                where: { email: email },
            });
            if (!userExists)
                throw new common_1.BadRequestException('El usuario no existe');
            function encryptToHex(text, key) {
                let encryptedHex = '';
                for (let i = 0; i < text.length; i++) {
                    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                    encryptedHex += charCode.toString(16).padStart(2, '0');
                }
                return encryptedHex;
            }
            const encryptedHexMessage = encryptToHex(email, 'secretkey');
            const resetLink = `${domain}/forgotPassword/${encryptedHexMessage}`;
            const textContent = `Hola ${userExists.Names},\n\nPuedes restablecer tu contraseña utilizando el siguiente enlace:\n\n${resetLink}\n\nSi no solicitaste un restablecimiento de contraseña, ignora este correo.\n\nSaludos cordiales,\nEquipo de BP Ventures`;
            const htmlContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <img src="https://i.postimg.cc/BZ5YWZCk/bpventures-logo.png" alt="BP Ventures" style="max-width: 600px; margin-top: 20px;">

          <h1>Solicitud de Restablecimiento de Contraseña</h1>
          <p>Hola ${userExists.Names},</p>
          <p>Puedes restablecer tu contraseña utilizando el siguiente enlace:</p>

          <a href="${resetLink}"
          style="font-family: 'Futura', sans-serif; background-color: #2b4168; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 9999px; width: 100%; outline: none; box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0); cursor: pointer; max-width: 20em; text-decoration: none; font-size: 1em; text-align: center; display: inline-block;"
          onmouseover="this.style.backgroundColor='#1e2a44'"
          onmouseout="this.style.backgroundColor='#2b4168'"
          onfocus="this.style.boxShadow='0 0 0 0.2rem rgba(43, 65, 104, 0.5)'"
          onblur="this.style.boxShadow='0 0 0 0.2rem rgba(255, 255, 255, 0)'"
          >
          Restablecer Contrase&ntilde;a
          </a>

          <p>Si no solicitaste un restablecimiento de contrase&ntilde;a, ignora este correo.</p>
          <p>Saludos cordiales,<br>Equipo de BP Ventures</p>
        </div>
      `;
            await this.mailService.sendMail(email, 'BP Ventures - Restablecimiento de Contraseña', textContent, htmlContent);
            return {
                message: '¡El enlace para restablecer la contraseña ha sido enviado a tu correo electrónico!',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async resetPassword(token, newPassword) {
        function decryptFromHex(encryptedHex, key) {
            let decryptedText = '';
            for (let i = 0; i < encryptedHex.length; i += 2) {
                const hexPair = encryptedHex.slice(i, i + 2);
                const charCode = parseInt(hexPair, 16) ^ key.charCodeAt((i / 2) % key.length);
                decryptedText += String.fromCharCode(charCode);
            }
            return decryptedText;
        }
        const decryptedMessage = decryptFromHex(token.toString(), 'secretkey');
        const user = await this.userRepository.findOne({
            where: { email: decryptedMessage },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid token');
        user.password = await (0, hash_1.hashPassword)(newPassword);
        await this.userRepository.save(user);
    }
    validateMfa(token, secret) {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
        });
    }
    async generateMfaSecret(email, userId) {
        const secret = speakeasy.generateSecret({
            name: `BP Ventures (${email})`,
            length: 20,
        });
        await this.userRepository.update(userId, {
            mfaSecret: secret.base32,
            mfaEnabled: true,
        });
        return secret;
    }
    async generateMfaQrCode(secret) {
        const otpAuthUrl = secret.otpauth_url;
        return await qrcode.toDataURL(otpAuthUrl);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map