<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils/shadcn'
	import {
		ArrowDownUp,
		ChartBar,
		Import,
		Key,
		LayoutDashboard,
		Link,
		PanelRightClose,
		PanelRightOpen,
		Plus,
		Rabbit,
	} from 'lucide-svelte'
	import type { Snippet } from 'svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import {
		activeWorkspace,
		activeWorkspaceId,
		hasNoWorkspaces,
		isCreateWorkspaceDialogOpen,
		isImportWorkspaceDialogOpen,
		isStoreHydrating,
		workspaces,
	} from '$lib/store'
	import CreateWorkspaceDialog from '$lib/components/CreateWorkspaceDialog.svelte'
	import WorkspaceSwitcherDialog from '$lib/components/WorkspaceSwitcherDialog.svelte'
	import ImportWorkspaceDialog from '$lib/components/ImportWorkspaceDialog.svelte'

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
			name: 'Links',
			path: '/links',
			icon: Link,
		},
		{
			name: 'Analytics',
			path: '/analytics',
			icon: ChartBar,
		},
		{
			name: 'API Keys',
			path: '/api-keys',
			icon: Key,
		},
	]

	let isSidebarOpen = $state(true)
	let showWorkspaceSelectorDialog = $state(false)

	$effect(() => {
		if ($isStoreHydrating === false && $hasNoWorkspaces) {
			$isCreateWorkspaceDialogOpen = true
		}
	})

	$effect(() => {
		if ($activeWorkspaceId === null && $workspaces.length > 0) {
			$activeWorkspaceId = $workspaces[0].id
		}
	})
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
				class={cn('p-2', isSidebarOpen === false && 'mx-auto')}
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
		{#if $isStoreHydrating}
			<div class="w-full px-4">
				<Skeleton class="dark h-[40px] w-full rounded" />
			</div>
		{:else if $hasNoWorkspaces}
			{#if isSidebarOpen}
				<div class="flex w-full flex-col items-center gap-2 px-4">
					<Rabbit
						size={48}
						class="text-muted-foreground"
						strokeWidth={1}
					/>
					<p class="text-sm text-muted-foreground">
						Create Workspace to Get started
					</p>
				</div>
			{/if}
		{:else}
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
									isActive && 'font-semibold text-brand-500',
								)}
								>{route.name}
							</span>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	{/snippet}

	{#snippet SidebarWorkspaceSelector()}
		{#if $isStoreHydrating === false}
			<div class="px-4">
				<Button
					onclick={() => {
						if ($hasNoWorkspaces) {
							$isCreateWorkspaceDialogOpen = true
						} else {
							showWorkspaceSelectorDialog = true
						}
					}}
					class={cn(
						'group flex min-h-fit w-full justify-start transition',
						$hasNoWorkspaces &&
							'animate-heartbeat border border-brand-700',
					)}
				>
					{#if $hasNoWorkspaces}
						<Plus
							size={20}
							class="transition group-hover:text-brand-500"
						/>
					{:else}
						<ArrowDownUp
							size={20}
							class="transition group-hover:text-brand-500"
						/>
					{/if}
					{#if isSidebarOpen}
						{#if $hasNoWorkspaces}
							<span>Create Workspace</span>
						{:else}
							<span>{$activeWorkspace!.name}</span>
						{/if}
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
			isSidebarOpen && 'w-64',
		)}
	>
		{@render SidebarHeader()}
		{@render SidebarWorkspaceSelector()}
		{@render SidebarRoutes()}
	</div>
{/snippet}

<WorkspaceSwitcherDialog bind:open={showWorkspaceSelectorDialog} />

<CreateWorkspaceDialog bind:open={$isCreateWorkspaceDialogOpen} />

<ImportWorkspaceDialog bind:open={$isImportWorkspaceDialogOpen} />

<div
	class="flex max-h-screen flex-grow overflow-hidden bg-foreground text-background"
>
	{@render Sidebar()}

	<div
		class="brand-scrollbar my-4 flex flex-grow flex-col overflow-auto rounded-l-xl bg-background p-8 text-foreground"
	>
		{#if $isStoreHydrating}
			<div class="flex flex-col gap-4">
				<div class="flex">
					<Skeleton class="h-[50px] w-[200px] rounded" />
				</div>
				<Skeleton class="h-[200px] w-1/2 rounded" />
				<Skeleton class="h-[200px] w-1/2 rounded" />
			</div>
		{:else if $hasNoWorkspaces}
			<div
				class="flex h-full w-full flex-col items-center justify-center gap-4"
			>
				<Rabbit
					size={128}
					class="text-muted-foreground"
					strokeWidth={1}
				/>
				<h2 class="text-lg text-muted-foreground">
					Create Workspace to Get Started
				</h2>
				<Button
					onclick={() => {
						$isCreateWorkspaceDialogOpen = true
					}}><Plus /> Create Workspace</Button
				>
			</div>
		{:else}
			{@render children()}
		{/if}
	</div>
</div>
