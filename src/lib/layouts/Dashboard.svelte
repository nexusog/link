<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils/shadcn'
	import {
		ArrowDownUp,
		ChartBar,
		LayoutDashboard,
		PanelRightClose,
		PanelRightOpen,
	} from 'lucide-svelte'
	import type { Snippet } from 'svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import {
		activeWorkspace,
		activeWorkspaceId,
		isStoreHydrating,
		workspaces,
	} from '$lib/store'
	import * as Dialog from '$lib/components/ui/dialog'

	type Props = {
		children: Snippet
	}

	let { children }: Props = $props()

	const routes = [
		{
			name: 'Dashboard',
			path: '/',
			icon: LayoutDashboard,
		},
		{
			name: 'Analytics',
			path: '/analytics',
			icon: ChartBar,
		},
	]

	let isSidebarOpen = $state(true)
	let showWorkspaceSelectorDialog = $state(false)
</script>

{#snippet Sidebar()}
	{#snippet SidebarHeader()}
		<div class="flex items-center justify-between px-4">
			<h1
				class={cn(
					'text-2xl font-bold',
					isSidebarOpen === false && 'hidden',
				)}
			>
				Link
			</h1>
			<Button
				class="p-2"
				variant="ghost"
				onclick={() => (isSidebarOpen = !isSidebarOpen)}
			>
				{#if isSidebarOpen}
					<PanelRightOpen size={18} />
				{:else}
					<PanelRightClose size={20} />
				{/if}
			</Button>
		</div>
	{/snippet}

	{#snippet SidebarRoutes()}
		<div class="flex flex-grow flex-col gap-2 px-2">
			{#each routes as route}
				{@const isActive = route.path === page.url.pathname}

				<a
					href={route.path}
					class={cn(
						'flex items-center gap-2 rounded p-2 transition',
						'hover:bg-gray-600/20',
						isActive && 'bg-brand-600/20',
						isSidebarOpen === false && 'justify-center',
					)}
				>
					<route.icon
						size={isSidebarOpen ? 18 : 20}
						strokeWidth={isActive ? 2 : 1.5}
						class={cn(isActive && 'text-brand-500')}
					/>

					{#if isSidebarOpen}
						<span
							class={cn(
								isActive && 'text-brand-500 font-semibold',
							)}
							>{route.name}
						</span>
					{/if}
				</a>
			{/each}
		</div>
	{/snippet}

	{#snippet SidebarWorkspaceSelector()}
		{#if $isStoreHydrating === false}
			<div class="px-4">
				<Button
					onclick={() => (showWorkspaceSelectorDialog = true)}
					class="group flex w-full justify-start transition"
				>
					<ArrowDownUp
						size={20}
						class="group-hover:text-brand-500 transition"
					/>
					{#if isSidebarOpen}
						<span>{$activeWorkspace?.name} Workspace</span>
					{/if}
				</Button>
			</div>
		{:else}
			<div class="px-4">
				<Skeleton class="dark h-[40px] w-full rounded" />
			</div>
		{/if}
	{/snippet}

	<div
		class={cn(
			'flex flex-col gap-6 p-4 px-0 transition-all',
			isSidebarOpen && 'min-w-64',
		)}
	>
		{@render SidebarHeader()}
		{@render SidebarWorkspaceSelector()}
		{@render SidebarRoutes()}
	</div>
{/snippet}

<Dialog.Root bind:open={showWorkspaceSelectorDialog}>
	<Dialog.Content>
		<Dialog.Header class="space-y-4">
			<Dialog.Title>Select Workspace</Dialog.Title>

			<div class="flex w-full flex-col gap-2">
				{#each $workspaces as workspace}
					{@const isCurrent = workspace.id === $activeWorkspace?.id}
					<Button
						variant="ghost"
						class={cn(
							'w-full justify-start',
							isCurrent && 'bg-brand-600/20 text-brand-700',
						)}
						onclick={() => {
							$activeWorkspaceId = workspace.id
							showWorkspaceSelectorDialog = false
						}}
					>
						<span class="text-base">{workspace.name}</span>
					</Button>
				{/each}
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<div
	class="flex max-h-screen flex-grow overflow-hidden bg-foreground text-background"
>
	{@render Sidebar()}

	<div
		class="brand-scrollbar my-4 flex flex-grow flex-col overflow-auto rounded-l-xl bg-background p-4 text-foreground"
	>
		{@render children()}
	</div>
</div>
