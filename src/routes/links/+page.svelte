<script lang="ts">
	import KeyboardShortcut from '$lib/components/KeyboardShortcut.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import {
		activeWorkspaceDefaultApiKey,
		activeWorkspaceId,
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
		QrCode,
		Settings2,
		Trash2,
	} from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Pagination from '$lib/components/ui/pagination'
	import * as Select from '$lib/components/ui/select'
	import { debounce } from 'lodash-es'
	import CreateLinkDialog from '$lib/components/CreateLinkDialog.svelte'
	import * as api from '$lib/utils/api'
	import Link from '$lib/components/Link.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import QRCodeGenerator from 'qrcode'
	import MiniLinkClicksChart from '$lib/components/MiniLinkClicksChart.svelte'
	import { transformEngagementsIntoDateCount } from '$lib/utils/transformEngagements'

	let isDisplayDropdownOpen = $state(false)
	let searchInputValue = $state('')
	let showQRCodeDialog = $state(false)
	let QRCodeDialogLinkId = $state<string | null>(null)

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
				$activeWorkspaceId!,
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
				showQRCodeDialog = true
				QRCodeDialogLinkId = linkId
			}}
		>
			<QrCode class="mr-1 size-4" />
			<span>Show QR Code</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => {
				handleLinkDelete(linkId)
			}}
			class="text-destructive"
		>
			<Trash2 class="mr-1 size-4" />
			<span>Delete</span>
		</DropdownMenu.Item>
	</DropdownMenu.Group>
{/snippet}

{#snippet LinkQRCodeDialog()}
	<Dialog.Root bind:open={showQRCodeDialog}>
		<Dialog.Content class="w-[300px]">
			<Dialog.Header>
				<Dialog.Title>QR Code</Dialog.Title>
			</Dialog.Header>

			<div class="flex w-full items-center justify-center py-2">
				{#await $activeWorkspaceLinksWithExtras}
					<Skeleton class="aspect-square h-[200px]" />
				{:then { data }}
					{@const link = data.links.find(
						(e: any) => e.id === QRCodeDialogLinkId,
					)}
					{@const linkHref = `${location.origin}/${link.shortName || link.id}?qr`}

					{#await QRCodeGenerator.toDataURL( linkHref, { width: 200, margin: 0, scale: 16 }, ) then dataURL}
						<img
							title={linkHref}
							src={dataURL}
							class="aspect-square rounded"
							alt=""
						/>
					{/await}
				{/await}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

<CreateLinkDialog bind:open={$isCreateLinkDialogOpen} />

{@render LinkQRCodeDialog()}

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
										<Link
											class="font-semibold"
											href={linkHref}
										>
											{linkHrefWithoutProtocol}
										</Link>
									{/if}
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
										<Link href={linkHref}>
											{linkHrefWithoutProtocol}
										</Link>
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

									<Link
										href={link.url}
										class="max-w-[50ch] overflow-hidden text-ellipsis whitespace-nowrap tracking-tighter"
									>
										{link.url}
									</Link>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-4">
							{#await link.stats() then statsResponse}
								{@const engagements =
									statsResponse.data.data.data.engagements}
								{@const transformedEngagements =
									transformEngagementsIntoDateCount(
										engagements,
									)}
								{#if transformedEngagements.length > 1}
									<MiniLinkClicksChart
										data={transformedEngagements}
									/>
								{/if}
							{/await}

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
