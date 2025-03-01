<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import {
		activeWorkspace,
		activeWorkspaceDefaultApiKey,
		activeWorkspaceStats,
	} from '$lib/store'
	import { getLinkById, getWorkspaceStats } from '$lib/utils/api'
	import { ExternalLink, Meh } from 'lucide-svelte'
</script>

{#snippet StatsNumberCard(title: string, value: number)}
	<div class="flex flex-col gap-6 rounded border p-4 pb-6 hover:shadow">
		<h2 class="text-base font-semibold">{title}</h2>
		<div class="text-center text-7xl font-semibold text-brand-600">
			{value}
		</div>
	</div>
{/snippet}

<div class="flex w-full flex-grow flex-col gap-6">
	<h1 class="text-3xl font-semibold">Dashboard</h1>
	{#await $activeWorkspaceStats}
		<div class="flex gap-4">
			<Skeleton class="h-[130px] w-[300px]" />
			<Skeleton class="h-[130px] w-[300px]" />
			<Skeleton class="h-[130px] w-[300px]" />
		</div>
		<div class="flex gap-4">
			<Skeleton class="h-[300px] w-[500px]" />
			<Skeleton class="h-[300px] w-[500px]" />
		</div>
	{:then stats}
		{#if !stats}
			<div
				class="flex w-full flex-col items-center justify-center gap-2 py-16"
			>
				<Meh size={64} class="text-destructive" />
				<h1 class="text-xl font-semibold text-destructive">
					Oops! Something went wrong.
				</h1>
			</div>
		{:else}
			{@const data = stats}
			<div class="stats-grid grid gap-4">
				{@render StatsNumberCard('Total Links', data.numberOfLinks)}
				{@render StatsNumberCard(
					'Total Engagements',
					data.totalEngagements,
				)}
				{@render StatsNumberCard(
					'Total Engagements (Last Week)',
					data.totalEngagementsLastWeek,
				)}
			</div>
			{#if data.topPerformingLinks.length > 0}
				<div
					class="w-fit min-w-96 space-y-4 rounded border p-4 hover:shadow"
				>
					<h2 class="px-2 text-base font-semibold">
						Top Performing Links
					</h2>
					<div class="flex flex-col gap-2">
						{#snippet Skels()}
							<Skeleton class="h-[40px] w-full" />
							<Skeleton class="h-[40px] w-full" />
							<Skeleton class="h-[40px] w-full" />
						{/snippet}

						{#await $activeWorkspaceDefaultApiKey}
							{@render Skels()}
						{:then apiKey}
							{#each data.topPerformingLinks as performingLink, index}
								{#await getLinkById(performingLink.id, $activeWorkspace!.id, apiKey!.key)}
									<Skeleton class="h-[40px] w-full" />
								{:then { data: response, error }}
									{#if error || !response?.data?.data}
										<div class="flex p-2 text-destructive">
											Failed to fetch
										</div>
									{:else}
										{@const link = response.data.data}
										<div
											class="flex items-start gap-2 rounded border border-transparent p-2 transition hover:border-brand-600/20 hover:bg-brand-300/5"
										>
											<div class="text-sm font-semibold">
												{index + 1}.
											</div>
											<div
												class="flex flex-grow flex-col gap-0.5"
											>
												<div class="text-sm">
													{link.title}
												</div>
												<a
													target="_blank"
													class="group flex items-center gap-1 text-xs text-muted-foreground hover:text-brand-600 hover:underline"
													href={`${location.origin}/${link.shortName || link.id}`}
												>
													<span class="">
														{location.host}/{link.shortName ||
															link.id}
													</span>
													<ExternalLink
														class="hidden group-hover:block"
														size={10}
													/>
												</a>
											</div>
											<div
												class="text-sm font-semibold text-brand-600"
											>
												{performingLink.totalEngagements}
											</div>
										</div>
									{/if}
								{/await}
							{/each}
						{/await}
					</div>
				</div>
			{/if}
		{/if}
	{/await}
</div>

<style>
	.stats-grid {
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
</style>
