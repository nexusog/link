<script lang="ts">
	import { cn } from '$lib/utils/shadcn'
	import { Copy, ExternalLink } from 'lucide-svelte'
	import type { Snippet } from 'svelte'
	import { toast } from 'svelte-sonner'

	type Props = {
		href: string
		class?: string
		children?: Snippet
		iconSize?: number
	}

	let {
		href = $bindable(),
		class: className = $bindable(),
		children,
		iconSize = $bindable(12),
	}: Props = $props()
</script>

<a
	{href}
	target="_blank"
	class={cn(
		'group/a flex items-center gap-1 hover:text-brand-600 hover:underline',
		className,
	)}
	rel="noreferrer"
>
	{#if children}
		<span
			class="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
		>
			{@render children()}
		</span>
	{/if}

	<ExternalLink bind:size={iconSize} class="hidden group-hover/a:block" />

	<Copy
		onclick={(event) => {
			event.preventDefault()
			navigator.clipboard.writeText(href)
			toast.info('Copied to Clipboard')
		}}
		class="hidden group-hover/a:block"
		bind:size={iconSize}
	/>
</a>
