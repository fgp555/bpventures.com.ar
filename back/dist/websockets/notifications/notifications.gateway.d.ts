import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../../modules/notifications/notifications.service';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationsService;
    server: Server;
    constructor(notificationsService: NotificationsService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitNotificationToUser(userId: string | string[] | number[], payload: any): void;
    private getUserIdFromClient;
}
