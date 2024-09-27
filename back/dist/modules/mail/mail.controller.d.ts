import { MailService } from './mail.service';
export declare class EmailController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendEmail(body: {
        to: string;
        subject: string;
        text: string;
    }): Promise<{
        message: string;
    }>;
}
