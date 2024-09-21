<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	
	import ThumbsUp from 'lucide-svelte/icons/thumbs-up';
	import MessageCircle from 'lucide-svelte/icons/message-circle';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Send from 'lucide-svelte/icons/send';

	const posts = [
		{
			id: 1,
			user: {
				name: 'Alice Johnson',
				avatar: '',
				title: 'Senior Software Engineer at TechCorp'
			},
			content: {
				type: 'text',
				text: "Excited to announce that our team has just launched a new feature that will revolutionize how our users interact with our platform. It's been months of hard work, but seeing it live is incredibly rewarding. #ProductLaunch #Innovation"
			},
			timestamp: '2h ago',
			likes: 42,
			comments: 7,
			shares: 3
		},
		{
			id: 2,
			user: {
				name: 'Bob Smith',
				avatar: '',
				title: 'Marketing Director at GrowthCo'
			},
			content: {
				type: 'image',
				text: 'Just wrapped up our annual marketing conference. Great insights and networking opportunities! #MarketingConf2023',
				image: '/placeholder.svg'
			},
			timestamp: '5h ago',
			likes: 89,
			comments: 13,
			shares: 8
		},
		{
			id: 3,
			user: {
				name: 'Carol White',
				avatar: '',
				title: 'Startup Founder & CEO'
			},
			content: {
				type: 'link',
				text: 'Check out my latest article on the future of AI in business. Would love to hear your thoughts!',
				link: 'https://example.com/ai-in-business'
			},
			timestamp: '1d ago',
			likes: 156,
			comments: 28,
			shares: 42
		}
	];
</script>

<div class="mx-auto max-w-2xl space-y-6 py-8">
	{#each posts as post (post.id)}
		<Card>
			<CardHeader>
				<div class="flex items-center space-x-4 font-sans">
					<Avatar>
						<AvatarImage src={post.user.avatar} alt={post.user.name} />
						<AvatarFallback class="">{post.user.name[0]}</AvatarFallback>
					</Avatar>
					<div>
						<h3 class="text-lg font-semibold">{post.user.name}</h3>
						<p class="text-sm text-gray-500">{post.user.title}</p>
						<p class="text-xs text-gray-400">{post.timestamp}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent class="text-sm">
				<p class="mb-4">{post.content.text}</p>
				{#if post.content.type === 'image'}
					<img src={post.content.image} alt={post.content.text} class="h-auto w-full rounded-lg" />
				{:else if post.content.type === 'link'}
					<a
						href={post.content.link}
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-600 hover:underline"
					>
						{post.content.link}
					</a>
				{/if}
			</CardContent>
			<CardFooter class="flex flex-col space-y-4">
				<div class="flex w-full items-center justify-between gap-1">
					<Button variant="ghost" size="sm" class="min-w-0 flex-1 px-2 text-gray-600">
						<ThumbsUp class="mr-1 h-4 w-4 flex-shrink-0" />
						<span class="truncate text-sm">{post.likes} Likes</span>
					</Button>
					<Button variant="ghost" size="sm" class="min-w-0 flex-1 px-2 text-gray-600">
						<MessageCircle class="mr-1 h-4 w-4 flex-shrink-0" />
						<span class="truncate text-sm">{post.comments} Comments</span>
					</Button>
					<Button variant="ghost" size="sm" class="min-w-0 flex-1 px-2 text-gray-600">
						<Share2 class="mr-1 h-4 w-4 flex-shrink-0" />
						<span class="truncate text-sm">{post.shares} Shares</span>
					</Button>
				</div>
				<Separator />
				<div class="flex w-full items-center space-x-2">
					<Avatar class="h-8 w-8">
						<AvatarImage src="" alt="Your avatar" />
						<AvatarFallback class="uppercase">H</AvatarFallback>
					</Avatar>
					<Input placeholder="Write a comment..." class="flex-grow" />
					<Button size="icon" variant="ghost">
						<Send class="h-4 w-4" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	{/each}
</div>
