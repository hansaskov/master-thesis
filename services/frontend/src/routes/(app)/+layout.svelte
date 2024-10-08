<script lang="ts">
	import { page } from '$app/stores';

	import Newspaper from 'lucide-svelte/icons/newspaper';
	import Wrench from 'lucide-svelte/icons/wrench';
	import House from 'lucide-svelte/icons/house';
	import User from 'lucide-svelte/icons/user';
	import Search from 'lucide-svelte/icons/search';
	import Target  from 'lucide-svelte/icons/target';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher } from 'mode-watcher';
	import NotificationBell from '$lib/components/NotificationBell.svelte';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import Settings from '$lib/components/Settings.svelte'
	import NavItem from '$lib/components/NavItem.svelte';
	import type { ComponentType } from 'svelte';
	import OrgCombobox from './systems/OrgCombobox.svelte';
	import SystemsComboBox from './systems/[id]/SystemsComboBox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';
	import LogOut from 'lucide-svelte/icons/log-out';
	import UserRoundCog from 'lucide-svelte/icons/user-round-cog';

	type NavItem = {
		name: string;
		href: string;
		icon: ComponentType;
	};

	const navItems: NavItem[] = [
		{ name: 'News Feed', icon: Newspaper, href: '/newsfeed' },
		{ name: 'Search', icon: Search, href: '/newsfeed' },
	];

	const settings: NavItem = { name: 'Support', icon: Wrench, href: '/support' };

	$: pathname = $page.url.pathname;
	$: breadcrumbs = pathname
		.split('/')
		.filter(Boolean)
		.map((segment, index, array) => ({
			href: `/${array.slice(0, index + 1).join('/')}`,
			label: segment.charAt(0).toUpperCase() + segment.slice(1),
			isLast: index === array.length - 1,
		}));
</script>

<ModeWatcher defaultTheme="light" />

<div class="flex min-h-screen w-full flex-col bg-background/40 text-foreground">
	<!-- Left sidebar (hidden on small screens) -->
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 py-4">
			<a href="/systems">
				<House class="w-5 h-5"/>
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

	<!-- Main content with padding at the bottom -->
	<div class="flex flex-col flex-1 sm:gap-4 sm:py-4 sm:pl-14 font-medium">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<!-- Breadcrumb and other header elements -->
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Page>
						<OrgCombobox></OrgCombobox>
					</Breadcrumb.Page>
						<Breadcrumb.Separator class="hidden sm:flex"></Breadcrumb.Separator>
						{#each breadcrumbs as crumb}
							{#if !crumb.isLast}
								<Breadcrumb.Link
									class="hidden sm:flex"
									href={crumb.href}
								>
									{crumb.label}
								</Breadcrumb.Link>
							{:else}
								<Breadcrumb.Page class="hidden sm:flex">{crumb.label}</Breadcrumb.Page>
							{/if}
								
							{#if !crumb.isLast}
								<Breadcrumb.Separator class="hidden sm:flex"></Breadcrumb.Separator>
							{/if}
						{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<nav class="flex items-center space-x-2 ml-auto">
				<!-- TODO: Hide settings for user without permissions to change settings of the page-->
				<Settings></Settings>
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
						<DropdownMenu.Item href="/settings">
							<UserRoundCog class="h-4 w-4 mr-2" />
							User Settings
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={toggleMode}>
							<Sun
								class="h-4 w-4 rotate-0 scale-100 dark:scale-0 mr-2"
							/>
							<Moon
								class="absolute h-4 w-4 rotate-90 scale-0 dark:scale-100 mr-2"
							/>
							<span>Toggle theme</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item href="/support">
							<Wrench class="h-4 w-4 mr-2" />
							Support
						</DropdownMenu.Item>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item href="/">
							<LogOut class="h-4 w-4 mr-2" />
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</nav>
		</header>

		<!--Bottom Padding-->
		<main class="p-4 pb-[5rem]">
			<slot></slot>
		</main>
	</div>

	<!-- Bottom navbar (only visible on small screens) -->
	<aside class="fixed inset-x-0 bottom-0 z-10 flex w-full flex-col border-t bg-background sm:hidden">
		<nav class="flex flex-row items-center justify-around gap-4 px-2 py-2">
			<a href="/systems" class="flex flex-col items-center justify-center">
				<House class="w-6 h-6"/>
				Home
				<span class="sr-only">Dashboard</span>
			</a>

			<a href="/newsfeed" class="flex flex-col items-center justify-center">
				<Newspaper />
				News
				<span class="sr-only">Dashboard</span>
			</a>

			<a href="/newsfeed" class="flex flex-col items-center justify-center">
				<Search />
				Search
				<span class="sr-only">Dashboard</span>
			</a>

			<a href="/support" class="flex flex-col items-center justify-center">
				<Wrench />
				Support
				<span class="sr-only">Dashboard</span>
			</a>
		</nav>
	</aside>
</div>
