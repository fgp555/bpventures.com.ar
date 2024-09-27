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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const notifications_service_1 = require("../../modules/notifications/notifications.service");
let NotificationsGateway = class NotificationsGateway {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    afterInit(server) {
        console.log('Notifications gateway initialized');
    }
    handleConnection(client) {
        const userId = this.getUserIdFromClient(client);
        if (userId) {
            client.join(`user_${userId}`);
            console.log(`Client ${client.id} joined room: user_${userId}`);
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    emitNotificationToUser(userId, payload) {
        console.log(`Emitting notification to user ${userId}:`, payload);
        this.server.to(`user_${userId}`).emit('newNotification', payload);
    }
    getUserIdFromClient(client) {
        return client.handshake.query.userId;
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map