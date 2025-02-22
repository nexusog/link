<svelte:options runes />

<script lang="ts">
	import { activeWorkspaceApiKeys, type ApiKey } from '$lib/store'
	import { Copy, Info } from 'lucide-svelte'
	import * as Tooltip from '$lib/components/ui/tooltip/index.js'
	import { toast } from 'svelte-sonner'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { DEFAULT_API_KEY_LABEL } from '$lib/const'
</script>

{#snippet CopyButton(data: string)}
	<Copy
		size={16}
		class="cursor-pointer"
		onclick={() => {
			navigator.clipboard.writeText(data)
			toast.info('Copied to Clipboard')
		}}
	/>
{/snippet}

{#snippet APIKeyCard(data: ApiKey)}
	{@const isDefault = data.label === DEFAULT_API_KEY_LABEL}
	<div class="flex flex-col gap-2 rounded border p-4 hover:shadow">
		<div class="flex items-center gap-2 text-base font-semibold">
			<span>{data.label}</span>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<Info size={14} />
					</Tooltip.Trigger>
					{#if isDefault}
						<Tooltip.Content side="right">
							<p>This is the default API key for the UI</p>
						</Tooltip.Content>
					{/if}
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
		<div class="flex gap-2">
			<div class="text-sm text-muted-foreground">{data.id}</div>
			{@render CopyButton(data.id)}
		</div>
		<div class="flex gap-2">
			<div
				class="max-w-[16ch] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground"
			>
				{data.key}
			</div>
			{@render CopyButton(data.key)}
		</div>
		<div></div>
		<div class="flex flex-wrap gap-2">
			{#each data.permissions as permission}
				<div
					class="w-fit rounded bg-brand-600/20 p-1 px-2 text-xs text-brand-800"
				>
					{permission}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class="flex w-full flex-col gap-4">
	<h1 class="text-3xl font-semibold">API Keys</h1>

	<div class="api-key-grid grid w-full gap-4">
		{#await $activeWorkspaceApiKeys}
			{#each { length: 4 } as _}
				<Skeleton class="h-[150px] w-full" />
			{/each}
		{:then apiKeys}
			{#each apiKeys as apiKey}
				{@render APIKeyCard(apiKey)}
			{/each}
		{/await}
	</div>
</div>

<style>
	.api-key-grid {
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	}
</style>
