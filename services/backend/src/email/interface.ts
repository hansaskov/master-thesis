// First, define an interface for our email service
export interface IEmailSecrvice {
	send(
		from: string,
		to: string,
		subject: string,
		html: string,
	): Promise<boolean>;
}
