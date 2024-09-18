<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	const supportDetails = {
		phone: "+45 63 15 47 00",
		email: "support@trivision.dk",
		officeHours: "8-16 (CET)",
	};
</script>

<Card.Root class="w-full max-w-4xl mx-auto my-8">
	<Card.Header>
		<Card.Title>Support Information</Card.Title>
	</Card.Header>
	
	<Card.Content>
		<p class="mt-4">
			Our customers worldwide can rely on remote assistance from TriVision's support team to keep downtime at a minimum.
        <p class="mt-4">
            The support team keeps TriVision systems updated, performs checks regularly, and provides fast response remote support if incidents occur.
		<p class="mt-4 text-lg font-semibold">
			For remote assistance within office hours:
		</p>

		<div class="mt-4">
			<p class="font-bold text-red-600">{supportDetails.phone}</p>
			<p class="font-bold text-red-600">
                <a href={`mailto:${supportDetails.email}`}>
					{supportDetails.email}
				</a>
            </p>
			<p class="mt-2 text-md">Office Hours: {supportDetails.officeHours}</p>
		</div>
	</Card.Content>
</Card.Root>

