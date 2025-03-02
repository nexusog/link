<script lang="ts">
	import KeyboardShortcut from '$lib/components/KeyboardShortcut.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import {
		activeWorkspace,
		activeWorkspaceDefaultApiKey,
		activeWorkspaceLinks,
		activeWorkspaceLinksCreatedRefCounter,
		activeWorkspaceLinksPageNumber,
		activeWorkspaceLinksSearch,
		activeWorkspaceLinksSortBy,
		activeWorkspaceLinksWithExtras,
		isCreateLinkDialogOpen,
	} from '$lib/store'
	import { getLinkStatsCount } from '$lib/utils/api'
	import { cn } from '$lib/utils/shadcn'
	import {
		ArrowUpDown,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		Copy,
		CornerDownRight,
		EllipsisVertical,
		ExternalLink,
		Filter,
		LoaderCircle,
		Meh,
		MousePointerClick,
		Settings2,
		Trash2,
	} from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Pagination from '$lib/components/ui/pagination'
	import * as Select from '$lib/components/ui/select'
	import moment from 'moment'
	import { debounce } from 'lodash-es'
	import CreateLinkDialog from '$lib/components/CreateLinkDialog.svelte'
	import * as api from '$lib/utils/api'

	let isDisplayDropdownOpen = $state(false)
	let searchInputValue = $state('')

	let loadingLinks = $state<string[]>([])
	let searchLinksInputRef = $state<HTMLElement | null>(null)

	const handleSearchInput = debounce(() => {
		$activeWorkspaceLinksSearch = searchInputValue
	}, 300)

	async function handleLinkDelete(linkId: string) {
		try {
			loadingLinks.push(linkId)

			const { error, data: response } = await api.deleteLink(
				linkId,
				$activeWorkspace!.id,
				(await $activeWorkspaceDefaultApiKey)!.key,
			)

			if (error || response?.data.error) {
				toast.error(
					error?.response?.data.message ||
						error?.message ||
						'Something went wrong',
				)
				return
			}

			$activeWorkspaceLinksCreatedRefCounter--
		} catch (e) {
			console.error(e)
			toast.error('Something went wrong')
		} finally {
			loadingLinks = loadingLinks.filter((id) => id !== linkId)
		}
	}

	$effect(() => {
		function handleKeyboardShortcut(event: KeyboardEvent) {
			if ((event.target as HTMLElement).tagName === 'INPUT') {
				return
			}

			if (event.key === 'c') {
				event.preventDefault()
				$isCreateLinkDialogOpen = true
			}

			if (event.key == '/') {
				event.preventDefault()
				searchLinksInputRef?.focus()
			}

			if (event.key === 'd') {
				event.preventDefault()
				isDisplayDropdownOpen = !isDisplayDropdownOpen
			}
		}

		document.addEventListener('keydown', handleKeyboardShortcut)

		return () => {
			document.removeEventListener('keydown', handleKeyboardShortcut)
		}
	})
</script>

{#snippet LinkFavicon(url: string)}
	<img
		src="https://favicon.im/{new URL(url).hostname}"
		class="h-5 max-h-5 min-h-5 w-5 min-w-5 max-w-5 rounded-full"
		alt=""
	/>
{/snippet}

{#snippet DisplayOptionCardContent()}
	{@const values = [
		{
			value: 'createdAt',
			label: 'Date created',
		},
		{
			value: 'totalRedirects',
			label: 'Total Clicks',
		},
	]}

	<div class="flex min-w-[300px] flex-col p-0">
		<!-- <hr class="w-full" /> -->

		<div class="flex items-center justify-between px-4 py-4 text-sm">
			<div class="flex items-center gap-2">
				<ArrowUpDown size={14} />
				<span>Ordering</span>
			</div>
			<div>
				<Select.Root
					type="single"
					bind:value={$activeWorkspaceLinksSortBy}
					onValueChange={() => (isDisplayDropdownOpen = false)}
				>
					<Select.Trigger class="w-fit"
						>{values.find(
							(e) => e.value === $activeWorkspaceLinksSortBy,
						)?.label ?? 'Select SortBy'}</Select.Trigger
					>
					<Select.Content>
						{#each values as { value, label }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- <hr class="w-full" /> -->
	</div>
{/snippet}

{#snippet LinkCardMoreOptionsDialogCardContent(linkId: string)}
	<DropdownMenu.Group>
		<DropdownMenu.Item
			onclick={() => {
				handleLinkDelete(linkId)
			}}
			class="text-destructive"
		>
			<Trash2 class="mr-2 size-4" />
			<span>Delete</span>
		</DropdownMenu.Item>
	</DropdownMenu.Group>
{/snippet}

<CreateLinkDialog bind:open={$isCreateLinkDialogOpen} />

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
			<DropdownMenu.Root bind:open={isDisplayDropdownOpen}>
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
					{@render DisplayOptionCardContent()}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="flex justify-center gap-2">
			<Input
				bind:ref={searchLinksInputRef}
				bind:value={searchInputValue}
				oninput={handleSearchInput}
				class="h-full w-64"
				placeholder="Search..."
			/>
			<Button
				size="lg"
				class="w-fit px-5"
				onclick={() => ($isCreateLinkDialogOpen = true)}
				>Create link
				<KeyboardShortcut>C</KeyboardShortcut>
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#await $activeWorkspaceLinksWithExtras}
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
				{#if data.links.length === 0}
					<div
						class="flex w-full flex-col items-center gap-1 pt-16 opacity-80"
					>
						<Meh size={64} class="text-destructive" />
						<h1 class="text-xl font-semibold text-destructive">
							No links found for this search
						</h1>
					</div>
				{/if}

				{#each data.links as link}
					{@const linkHrefWithoutProtocol = `${location.host}/${link.shortName || link.id}`}
					{@const linkHref = `${location.origin}/${link.shortName || link.id}`}
					{@const isLoading = loadingLinks.includes(link.id)}

					<div
						class={cn(
							'group/card flex w-full gap-16 rounded-xl border px-4 py-5 text-sm transition',
							isLoading === false && 'hover:shadow-md',
							isLoading &&
								'pointer-events-none cursor-wait blur-sm',
						)}
					>
						<div class="flex min-w-0 grow items-center gap-3">
							<div
								class="max-h-fit rounded-full border p-2 transition"
							>
								{#if isLoading}
									<LoaderCircle
										class="animate-[spin_500ms_linear_infinite]"
										size={12}
									/>
								{:else}
									{@render LinkFavicon(link.url)}
								{/if}
							</div>

							<div
								class="flex max-w-full flex-col gap-0 overflow-hidden"
							>
								<div class="flex items-center gap-3">
									{#if link.title}
										<span class="font-semibold">
											{link.title}
										</span>
									{:else}
										<a
											href={linkHref}
											target="_blank"
											class="font-semibold"
										>
											{linkHrefWithoutProtocol}
										</a>
									{/if}
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
								{#if link.title}
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
												href={linkHref}
												target="_blank"
												rel="noreferrer"
											>
												{linkHrefWithoutProtocol}
											</a>

											<ExternalLink
												size={12}
												class="hidden group-hover:block"
											/>
										</div>
									</div>
								{/if}
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
									<div
										class="ml-2 hidden text-xs group-hover/card:block"
									>
										{moment(link.createdAt).format(
											'MMM D, YYYY',
										)}
									</div>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-4">
							{#await link.statsCount()}
								<Skeleton class="h-[30px] w-[90px] rounded" />
							{:then { data: response, error }}
								{#if !error}
									{@const totalEngagements =
										response.data.data.totalRedirects}
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
									{@render LinkCardMoreOptionsDialogCardContent(
										link.id,
									)}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				{/each}

				{#if data.links.length > 0}
					{@const totalCount = data.count}
					{@const pageSize = data.pageSize}
					{@const page = data.page}

					<!-- Pagination -->
					<Pagination.Root
						count={totalCount}
						perPage={pageSize}
						{page}
						onPageChange={(newPageNumber) => {
							$activeWorkspaceLinksPageNumber = newPageNumber
						}}
						class="items-end"
					>
						{#snippet children({ pages, currentPage })}
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.PrevButton>
										<ChevronLeft class="size-4" />
										<span class="hidden sm:block"
											>Previous</span
										>
									</Pagination.PrevButton>
								</Pagination.Item>
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<Pagination.Link
												{page}
												isActive={currentPage ===
													page.value}
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item>
									<Pagination.NextButton>
										<span class="hidden sm:block">Next</span
										>
										<ChevronRight class="size-4" />
									</Pagination.NextButton>
								</Pagination.Item>
							</Pagination.Content>
						{/snippet}
					</Pagination.Root>
				{/if}
			{/if}
		{/await}
	</div>
</div>
