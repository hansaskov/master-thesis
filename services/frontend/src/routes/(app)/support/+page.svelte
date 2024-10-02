<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Phone, Mail, Clock } from 'lucide-svelte';

	const supportDetails = {
		phone: "+45 63 15 47 00",
		email: "support@trivision.dk",
		officeHours: "8-16 (CET)",
	};

	const faqs = [
		{
			question: "What types of support do you offer?",
			answer: "We offer remote assistance, system updates, regular checks, and fast response support for incidents."
		},
		{
			question: "How can I contact support outside of office hours?",
			answer: "For urgent matters outside office hours, please leave a message, and we'll get back to you as soon as possible."
		},
		{
			question: "Do you provide on-site support?",
			answer: "While we primarily offer remote support, on-site assistance can be arranged for complex issues that cannot be resolved remotely."
		},
		{
			question: "How quickly can I expect a response?",
			answer: "We strive to respond to all support requests within 1 business day, with faster response times for critical issues."
		},
	];
</script>

<div class="container mx-auto px-4 py-8">
	<div class="grid gap-8 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-bold">Support Information</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="mt-4 text-muted-foreground">
					Our customers worldwide can rely on remote assistance from TriVision's support team to keep downtime at a minimum.
				</p>
				<p class="mt-4 text-muted-foreground">
					The support team keeps TriVision systems updated, performs checks regularly, and provides fast response remote support if incidents occur.
				</p>
				<p class="mt-6 text-lg font-semibold">
					For remote assistance within office hours:
				</p>
				<div class="mt-4 space-y-2">
					<div class="flex items-center space-x-2">
						<Phone class="h-5 w-5 text-primary" />
						<p class="font-bold text-primary">{supportDetails.phone}</p>
					</div>
					<div class="flex items-center space-x-2">
						<Mail class="h-5 w-5 text-primary" />
						<a href="mailto:{supportDetails.email}" class="font-bold text-primary hover:underline">
							{supportDetails.email}
						</a>
					</div>
					<div class="flex items-center space-x-2">
						<Clock class="h-5 w-5 text-muted-foreground" />
						<p class="text-muted-foreground">Office Hours: {supportDetails.officeHours}</p>
					</div>
				</div>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-bold">Frequently Asked Questions</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion.Root>
					{#each faqs as faq, index}
						<Accordion.Item value="item-{index}">
							<Accordion.Trigger>{faq.question}</Accordion.Trigger>
							<Accordion.Content>
								{faq.answer}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</CardContent>
		</Card>
	</div>
</div>