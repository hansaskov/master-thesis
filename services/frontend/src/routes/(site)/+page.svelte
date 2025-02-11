<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<!-- Login Page Component (login/+page.svelte) -->
<div class="grid h-[calc(100vh-8rem)] lg:grid-cols-2">
	<div class="flex items-center justify-center p-8">
		<div class="w-[350px] space-y-6">
			<div class="text-center">
				<h1 class="text-3xl font-bold">Welcome Back</h1>
				<p class="text-muted-foreground">Log in to your account using your Microsoft credentials</p>
			</div>

			<Button href="/api/login/microsoft" variant="outline" class="w-full">
				Login with Microsoft
			</Button>

			<p class="text-sm text-center">
				Don't have an account?
				<a href="/signup" class="underline">Contact your administrator</a>
			</p>
		</div>
	</div>

	<div class="hidden relative bg-muted lg:block">
		<img
			src="/placeholder.svg"
			alt="TriVision Quality Control System"
			width="1920"
			height="1080"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
