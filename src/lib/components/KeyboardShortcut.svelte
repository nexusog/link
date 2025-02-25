<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<div
	class="dark h-fit rounded bg-accent p-2 py-0.5 text-sm text-muted-foreground"
>
	{@render children()}
</div>
