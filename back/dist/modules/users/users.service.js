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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const hash_1 = require("../../utils/hash");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        const users = await this.userRepository.find({
            relations: ['company'],
            order: { id: 'ASC' },
        });
        const usersWithoutPassword = users.map((user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        return usersWithoutPassword;
    }
    async getUsers(page, Limit) {
        if (page === undefined || Limit === undefined) {
            const results = await this.userRepository.find({
                relations: ['company'],
                order: { id: 'ASC' }
            });
            const users = results.map((user) => {
                const { password, ...usuariosinpassword } = user;
                return usuariosinpassword;
            });
            const filteredUsers = users.filter(user => user.statusId === 1 || user.statusId === 2);
            return filteredUsers;
        }
        const results = await this.userRepository.find({
            skip: (page - 1) * Limit,
            take: Limit,
            order: { id: 'ASC' }
        });
        const users = results.map((user) => {
            const { password, ...usuariosinpassword } = user;
            return usuariosinpassword;
        });
        const totalPages = Math.ceil((await this.userRepository.count()) / Limit);
        const filteredUsers = users.filter(user => user.statusId === 1 || user.statusId === 2);
        const data = { users: filteredUsers, totalPages };
        return data;
    }
    async updateUser(id, updateUser) {
        const user = await this.userRepository.findOne({ where: { id } });
        console.log('update user', user);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const updatedUser = { ...user, ...updateUser };
        updatedUser.modifiedAt = new Date();
        if (updateUser.password) {
            updatedUser.password = await (0, hash_1.hashPassword)(updateUser.password);
        }
        const savedUser = await this.userRepository.save(updatedUser);
        const { password, ...userWithoutPassword } = savedUser;
        console.log(userWithoutPassword);
        const filteredUser = userWithoutPassword;
        return filteredUser;
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['invoices', 'invoices.invoiceStatus', 'company', 'invoices.company'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...usuarioSinPassword } = user;
        return usuarioSinPassword;
    }
    async updateUserStatus(userId, statusId) {
        const result = await this.userRepository.update(userId, { statusId: statusId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return { message: "User status updated" };
    }
    async deleteUser(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return result;
    }
    async verifyEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        user.verifiedEmail = true;
        return await this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map