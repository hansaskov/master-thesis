<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Welcome Back</h1>
				<p class="text-balance text-muted-foreground">
					Log in to your account using your Microsoft credentials
				</p>
			</div>
			<div class="grid gap-4">
				<Button href="/systems" variant="outline" class="w-full">Login with Microsoft</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="/signup" class="underline">Contact your administrator</a>
			</div>
		</div>
	</div>
	<div class="hidden bg-muted lg:block">
		<img
			src="/placeholder.svg"
			alt="TriVision Quality Control System"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
