<script lang="ts">
	import KeyboardShortcut from '$lib/components/KeyboardShortcut.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import {
		activeWorkspace,
		activeWorkspaceDefaultApiKey,
		activeWorkspaceLinks,
	} from '$lib/store'
	import { getLinkStatsCount } from '$lib/utils/api'
	import { cn } from '$lib/utils/shadcn'
	import {
		ChevronDown,
		Copy,
		CornerDownRight,
		EllipsisVertical,
		ExternalLink,
		Filter,
		Meh,
		MousePointerClick,
		Settings2,
	} from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
</script>

{#snippet LinkFavicon(url: string)}
	<img
		src="https://favicon.im/{new URL(url).hostname}"
		class="h-5 max-h-5 min-h-5 w-5 min-w-5 max-w-5 rounded-full"
		alt=""
	/>
{/snippet}

<div class="flex flex-grow flex-col gap-4">
	<h1 class="text-2xl font-semibold">Links</h1>
	<div class="my-1"></div>

	<div class="flex justify-between">
		<div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button
						size="lg"
						class="w-fit justify-start px-4"
						variant="outline"
					>
						<Filter />
						Filter
						<ChevronDown class="text-muted-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<div class="px-4 py-2 italic">Coming Soon!</div>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button
						size="lg"
						class="w-fit justify-start px-4"
						variant="outline"
					>
						<Settings2 />
						Display
						<ChevronDown class="text-muted-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<div class="px-4 py-2 italic">Coming Soon!</div>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="flex justify-center gap-2">
			<Input class="h-full w-64" placeholder="Search..." />
			<Button size="lg" class="w-fit px-5"
				>Create link
				<KeyboardShortcut>C</KeyboardShortcut>
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#await $activeWorkspaceLinks}
			<Skeleton class="h-[70px] w-full" />
			<Skeleton class="h-[70px] w-full" />
			<Skeleton class="h-[70px] w-full" />
		{:then { error, data }}
			{#if error}
				<div class="flex w-full flex-col items-center gap-1">
					<Meh size={64} class="text-destructive" />
					<h1 class="text-xl font-semibold text-destructive">
						Oops! Something went wrong.
					</h1>
				</div>
			{:else}
				{#each data.links as link}
					{@const linkHrefWithoutProtocol = `${location.host}/${link.shortName || link.id}`}
					{@const linkHref = `${location.origin}/${link.shortName || link.id}`}

					<div
						class="group/card flex w-full gap-16 rounded-xl border px-4 py-5 text-sm transition hover:shadow-md"
					>
						<div class="flex min-w-0 grow items-center gap-3">
							<div
								class="max-h-fit rounded-full border p-2 transition"
							>
								{@render LinkFavicon(link.url)}
							</div>

							<div
								class="flex max-w-full flex-col gap-0 overflow-hidden"
							>
								<div class="flex items-center gap-3">
									<a
										href={linkHref}
										target="_blank"
										class="font-semibold"
									>
										{linkHrefWithoutProtocol}
									</a>
									<Button
										variant="ghost"
										size="sm"
										class="h-fit p-1.5"
										onclick={() => {
											navigator.clipboard.writeText(
												linkHref,
											)
											toast.info('Copied to Clipboard')
										}}
									>
										<Copy size={11} />
									</Button>
								</div>
								<div
									class="flex min-w-0 items-center gap-1 text-muted-foreground"
								>
									<div>
										<CornerDownRight
											size={12}
											strokeWidth={1}
										/>
									</div>
									<div
										class="group flex items-center gap-1 overflow-hidden hover:text-brand-600 hover:underline"
									>
										<a
											class="max-w-[50ch] overflow-hidden text-ellipsis whitespace-nowrap tracking-tighter"
											href={link.url}
											target="_blank"
											rel="noreferrer"
										>
											{link.url}
										</a>

										<ExternalLink
											size={12}
											class="hidden group-hover:block"
										/>
									</div>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-4">
							{#await $activeWorkspaceDefaultApiKey then defaultApiKey}
								{#if defaultApiKey}
									{#await getLinkStatsCount(link.id, $activeWorkspace!.id, defaultApiKey.key)}
										<!--  -->
										<Skeleton
											class="h-[30px] w-[90px] rounded"
										/>
									{:then { data: response, error }}
										{#if !error}
											{@const totalEngagements =
												response.data.data
													.totalRedirects}
											<Button
												size="sm"
												class="h-fit gap-1 border bg-secondary/50 p-2 py-1 text-muted-foreground transition hover:text-foreground"
												variant="secondary"
											>
												<MousePointerClick
													class={cn(
														totalEngagements > 0 &&
															'text-brand-600',
													)}
													size={12}
												/>
												<span class="text-sm"
													>{totalEngagements} clicks</span
												>
											</Button>
										{/if}
									{/await}
								{:else}
									<!-- failed to get default api key -->
								{/if}
							{/await}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button
										size="icon"
										class="transition group-hover/card:border"
										variant="ghost"
									>
										<EllipsisVertical size={20} />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<div class="px-4 py-2 italic">
										Coming Soon!
									</div>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				{/each}
			{/if}
		{/await}
	</div>
</div>
