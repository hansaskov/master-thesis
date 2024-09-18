<script lang="ts">
	import { page } from '$app/stores';
	import {
		Newspaper,
		ChartLine,
		Monitor,
		Wrench,
		Settings,
		Search,
		Package2,
		User,
		PanelLeft
	} from 'lucide-svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher } from 'mode-watcher';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import NavItem from '$lib/components/NavItem.svelte';
	import type { ComponentType } from 'svelte';

	type NavItem = {
		name: string;
		href: string;
		icon: ComponentType;
	};

	const navItems: NavItem[] = [
		{ name: 'News Feed', icon: Newspaper, href: '/newsfeed' },
		{ name: 'Product Intelligence', icon: ChartLine, href: '/systems' }
	];

	const settings: NavItem = { name: 'Settings', icon: Settings, href: '/settings' };

	$: pathname = $page.url.pathname;
	$: breadcrumbs = pathname
		.split('/')
		.filter(Boolean)
		.map((segment, index, array) => ({
			href: `/${array.slice(0, index + 1).join('/')}`,
			label: segment.charAt(0).toUpperCase() + segment.slice(1),
			isLast: index === array.length - 1
		}));
</script>

<ModeWatcher defaultTheme="light" />

<div class="flex min-h-screen w-full flex-col bg-background/40 text-foreground">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 py-4">
			<a
				href="/"
				class="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
			>
				<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
				<span class="sr-only">Dashboard</span>
			</a>
			{#each navItems as item}
				<NavItem props={item} />
			{/each}
		</nav>
		<nav class="mt-auto flex flex-col items-center gap-4 px-2 py-4">
			<NavItem props={settings} />
		</nav>
	</aside>

	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Sheet.Root>
				<Sheet.Trigger>
					<Button size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="h-5 w-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="bg-card sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="/"
							class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
							<span class="sr-only">Dashboard</span>
						</a>
						{#each [...navItems, settings] as item}
							<a
								href={item.href}
								class="{`flex items-center gap-4 px-2.5 ${pathname.startsWith(item.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}}"
							>
								<svelte:component this={item.icon} class="h-5 w-5"></svelte:component>
								{item.name}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<Breadcrumb.Root class="hidden md:flex">
				<Breadcrumb.List>
					<Breadcrumb.Page class="font-medium">TriVision</Breadcrumb.Page>
					<Breadcrumb.Separator></Breadcrumb.Separator>
					{#each breadcrumbs as crumb}
						{#if !crumb.isLast}
							<Breadcrumb.Link class="font-medium" href={crumb.href}>
								{crumb.label}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page class="font-medium">{crumb.label}</Breadcrumb.Page>
						{/if}
						{#if !crumb.isLast}
							<Breadcrumb.Separator></Breadcrumb.Separator>
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div class="relative ml-auto flex-1 md:grow-0">
				<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"></Search>
				<Input
					type="search"
					placeholder="Search..."
					class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
				></Input>
			</div>

			<nav class="flex items-center space-x-2">
				<LightSwitch></LightSwitch>
				<NotificationBell></NotificationBell>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" size="icon" class="h-9 w-9 overflow-hidden rounded-full">
							<User class="h-4 w-4 overflow-hidden rounded-full"></User>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item>Settings</DropdownMenu.Item>
						<DropdownMenu.Item>Support</DropdownMenu.Item>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item>Logout</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</nav>
		</header>

		<main class="p-4">
			<slot></slot>
		</main>
	</div>
</div>
