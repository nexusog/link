<script lang="ts">
	import { cn } from '$lib/utils/shadcn'
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
		class?: string
	}

	const { children, class: className = $bindable('') }: Props = $props()
</script>

<div
	class={cn(
		'flex rounded border border-brand-500 bg-brand-600/10 p-0.5 px-1 text-xs text-brand-800',
		className,
	)}
>
	{@render children()}
</div>
