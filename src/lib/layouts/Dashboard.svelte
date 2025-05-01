<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils/shadcn'
	import {
		ArrowDownUp,
		BoxSelect,
		ChartBar,
		Import,
		Key,
		LayoutDashboard,
		Link,
		OctagonAlert,
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
		isActiveWorkspaceValid,
		isCreateWorkspaceDialogOpen,
		isImportWorkspaceDialogOpen,
		isStoreHydrating,
		workspaces,
	} from '$lib/store'
	import CreateWorkspaceDialog from '$lib/components/CreateWorkspaceDialog.svelte'
	import WorkspaceSwitcherDialog from '$lib/components/WorkspaceSwitcherDialog.svelte'
	import ImportWorkspaceDialog from '$lib/components/ImportWorkspaceDialog.svelte'
	import { isWorkspaceValid } from '$lib/utils/isWorkspaceValid'
	import ExportWorkspaceButton from '$lib/components/ExportWorkspaceButton.svelte'
	import { CustomEvents, plausible } from '$lib/plausible'
	import * as Alert from '$lib/components/ui/alert/index.js'
	import LinkComponent from '$lib/components/Link.svelte'

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
		plausible.trackEvent(
			isSidebarOpen
				? CustomEvents.EXPAND_SIDEBAR
				: CustomEvents.COLLAPSE_SIDEBAR,
		)
	})

	// if no workspaces, open creation dialog
	$effect(() => {
		if ($isStoreHydrating === false && $hasNoWorkspaces) {
			$isCreateWorkspaceDialogOpen = true
		}
	})

	// If we find active workspace invalid, we set active to null
	$effect(() => {
		;(async () => {
			if ((await $isActiveWorkspaceValid) === false) {
				$activeWorkspaceId = null
			}
		})()
	})

	$effect(() => {
		function handleKeyboardShortcut(event: KeyboardEvent) {
			if (event.key === 'w') {
				event.preventDefault()
				showWorkspaceSelectorDialog = true
			}
		}

		document.addEventListener('keydown', handleKeyboardShortcut)

		return () => {
			document.removeEventListener('keydown', handleKeyboardShortcut)
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
		{#snippet Skels()}
			<div class="w-full space-y-2 px-4">
				<Skeleton class="dark h-[40px] w-full rounded" />
				<Skeleton class="dark h-[40px] w-full rounded" />
				<Skeleton class="dark h-[40px] w-full rounded" />
				<Skeleton class="dark h-[40px] w-full rounded" />
			</div>
		{/snippet}

		{#snippet ErrorMessage(message: string)}
			{#if isSidebarOpen}
				<div class="flex w-full flex-col items-center gap-2 px-4">
					<Rabbit
						size={48}
						class="text-muted-foreground"
						strokeWidth={1}
					/>
					<p class="text-sm text-muted-foreground">
						{message}
					</p>
				</div>
			{/if}
		{/snippet}

		{#if $isStoreHydrating}
			{@render Skels()}
		{:else if $hasNoWorkspaces}
			{@render ErrorMessage('Create workspace to Get Started')}
		{:else if $hasNoWorkspaces === false && $activeWorkspace === null}
			{@render ErrorMessage('Select workspace to Get started')}
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
		{#snippet Skels()}
			<div class="px-4">
				<Skeleton class="dark h-[40px] w-full rounded" />
			</div>
		{/snippet}

		{#if $isStoreHydrating === false}
			<div class="px-4">
				<Button
					onclick={() => {
						if ($hasNoWorkspaces) {
							$isCreateWorkspaceDialogOpen = true
							return
						}

						showWorkspaceSelectorDialog = true
					}}
					class={cn(
						'group flex min-h-fit w-full justify-start transition',
						$hasNoWorkspaces &&
							'animate-heartbeat border border-brand-700',
					)}
				>
					{@const Icon = $hasNoWorkspaces ? Plus : ArrowDownUp}
					<Icon
						size={20}
						class="transition group-hover:text-brand-500"
					/>

					{#if isSidebarOpen}
						<span>
							{#if $hasNoWorkspaces}
								Create Workspace
							{:else if $hasNoWorkspaces === false && $activeWorkspaceId === null}
								<span>Select a Workspace</span>
							{:else}
								{#await $activeWorkspace}
									<Skeleton class="h-full w-[100px]" />
								{:then workspace}
									{workspace?.name}
								{/await}
							{/if}
						</span>
					{/if}
				</Button>
			</div>
		{:else}
			{@render Skels()}
		{/if}
	{/snippet}

	<div
		class={cn(
			'flex flex-col gap-6 p-4 px-0 transition-all',
			isSidebarOpen && 'w-64 min-w-64 max-w-64',
		)}
	>
		{@render SidebarHeader()}
		{@render SidebarWorkspaceSelector()}
		{@render SidebarRoutes()}

		{#if $activeWorkspaceId !== null}
			<div class="px-4">
				<ExportWorkspaceButton compact={!isSidebarOpen} />
			</div>
		{/if}
	</div>
{/snippet}

{#snippet PageError(message: string, children: Snippet)}
	{@const showEaster = Math.random() < 0.01}

	<div
		data-easter={showEaster}
		class="flex h-full w-full flex-col items-center justify-center gap-4"
	>
		<Rabbit
			size={128}
			class={cn(
				'text-muted-foreground',
				showEaster && 'animate-[bounce_400ms_infinite] text-brand-600',
			)}
			strokeWidth={1}
		/>
		<h2 class="text-lg text-muted-foreground">
			{message}
		</h2>
		{@render children()}
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
		class="brand-scrollbar my-4 flex flex-grow flex-col overflow-auto rounded-l-xl bg-background p-8 px-64 text-foreground"
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
			{#snippet CreateWorkspaceButton()}
				<Button
					onclick={() => {
						$isCreateWorkspaceDialogOpen = true
					}}><Plus /> Create Workspace</Button
				>
			{/snippet}

			{@render PageError(
				'Create workspace to Get Started',
				CreateWorkspaceButton,
			)}
		{:else if $hasNoWorkspaces === false && $activeWorkspaceId === null}
			{#snippet SelectWorkspaceButton()}
				<Button
					onclick={() => {
						showWorkspaceSelectorDialog = true
					}}><ArrowDownUp size={20} /> Select Workspace</Button
				>
			{/snippet}

			{@render PageError(
				'I see no workspace selected :(',
				SelectWorkspaceButton,
			)}
		{:else}
			<Alert.Root
				variant="default"
				class="mb-6 border border-yellow-600 bg-yellow-500/20 text-yellow-900"
			>
				<OctagonAlert class="stroke-yellow-700" size={20} />
				<Alert.Title>Warning</Alert.Title>
				<Alert.Description class="mt-1"
					>The domain <span class="font-bold"
						>link.nxog.tech will expire on November 30, 2025</span
					>, and <span class="font-bold">will not be renewed</span>.
					Please update your links to use the
					<a href="https://link.henil.dev" class="font-bold"
						>link.henil.dev</a
					>
					domain.</Alert.Description
				>
			</Alert.Root>
			{@render children()}
		{/if}
	</div>
</div>
