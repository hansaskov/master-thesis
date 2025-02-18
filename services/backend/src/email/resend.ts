import { env } from "elysia";
import { Resend } from "resend";
import type { IEmailSecrvice } from "./interface";

const RESEND_CLIENT_SECRET = env.RESEND_CLIENT_SECRET;
if (!RESEND_CLIENT_SECRET || RESEND_CLIENT_SECRET.length < 1)
	throw new Error(
		"You must provide a valid client secret for RESEND_CLIENT_SECRET",
	);

export class ResendClient implements IEmailSecrvice {
	private resend = new Resend(RESEND_CLIENT_SECRET);

	async send(
		from: string,
		to: string,
		subject: string,
		html: string,
	): Promise<boolean> {
		const response = await this.resend.emails.send({
			from,
			to,
			subject,
			html,
		});

		return response.error === null;
	}
}
