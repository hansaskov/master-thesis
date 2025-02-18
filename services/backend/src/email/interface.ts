import { ResendClient } from "./resend";

// First, define an interface for our email service
export interface IEmailSecrvice {
	send(props: {
		from: string;
		to: string;
		subject: string;
		html: string;
	}): Promise<boolean>;
}

export const emailClient = new ResendClient();
