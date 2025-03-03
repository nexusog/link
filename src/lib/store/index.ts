import { persisted } from 'svelte-persisted-store'
import * as devalue from 'devalue'
import { derived, get, writable } from 'svelte/store'
import {
	getApiKeys,
	getLinks,
	getLinkStatsCount,
	getWorkspace,
	getWorkspaceStats,
} from '$lib/utils/api'
import { DEFAULT_API_KEY_LABEL } from '$lib/const'
import { isWorkspaceValid } from '$lib/utils/isWorkspaceValid'

type StoreWorkspace = {
	name: string
	id: string
	secret: string
}

export type ApiKey = {
	id: string
	key: string
	label: string
	permissions: string[]
}

export const workspaces = persisted<StoreWorkspace[]>('workspaces', [], {
	serializer: devalue,
	storage: 'local',
})

export const workspacesWithExtras = derived(workspaces, async (workspaces) => {
	return await Promise.all(
		workspaces.map(async (workspace) => {
			return {
				...workspace,
				isValid: await isWorkspaceValid(workspace.id, workspace.secret),
			}
		}),
	)
})

export const activeWorkspaceId = persisted<string | null>(
	'activeWorkspaceId',
	null,
	{
		serializer: devalue,
		storage: 'local',
	},
)

export const activeWorkspace = derived(activeWorkspaceId, async (id) => {
	const workspaceObject =
		get(workspaces).find((workspace) => workspace.id === id) || null

	if (!workspaceObject) return null

	const { data: response, error } = await getWorkspace(
		workspaceObject.id,
		workspaceObject.secret,
	)

	console.log(response)

	if (error) return null

	return {
		...workspaceObject,
		name: response.data.data.name,
	}
})

export const isActiveWorkspaceValid = derived(
	activeWorkspace,
	async (workspace) => {
		if (!(await workspace)) return false

		return await isWorkspaceValid(
			(await workspace)!.id,
			(await workspace)!.secret,
		)
	},
)

export const hasNoWorkspaces = derived(workspaces, (workspaces) => {
	return workspaces.length === 0
})

export const isStoreHydrating = writable(true)

export const isCreateWorkspaceDialogOpen = writable(false)
export const isImportWorkspaceDialogOpen = writable(false)

export const activeWorkspaceApiKeys = derived(
	activeWorkspace,
	async (workspace): Promise<ApiKey[]> => {
		if (!(await workspace)) return []

		const { data: response } = await getApiKeys(
			(await workspace)!.id,
			(await workspace)!.secret,
		)

		if (!response) return []

		return response.data?.data?.apiKeys || []
	},
)

export const activeWorkspaceDefaultApiKey = derived(
	activeWorkspaceApiKeys,
	async (apiKeys) => {
		return (await apiKeys).find(
			(apiKey) => apiKey.label === DEFAULT_API_KEY_LABEL,
		)
	},
)

export const activeWorkspaceStats = derived(
	activeWorkspace,
	async (workspace) => {
		if (!(await workspace)) return null

		const { data: response } = await getWorkspaceStats(
			(await workspace)!.id,
			(await workspace)!.secret,
		)

		if (!response) return null

		return response.data.data
	},
)

export const isCreateLinkDialogOpen = writable(false)

export const activeWorkspaceLinksPageNumber = writable<number>(1)
export const activeWorkspaceLinksSortBy =
	writable<Required<NonNullable<Parameters<typeof getLinks>[2]>>['sortBy']>(
		'createdAt',
	)
export const activeWorkspaceLinksSearch = writable('')
export const activeWorkspaceLinksCreatedRefCounter = writable(0)

export const activeWorkspaceLinks = derived(
	[
		activeWorkspace,
		activeWorkspaceLinksPageNumber,
		activeWorkspaceLinksSortBy,
		activeWorkspaceLinksSearch,
		activeWorkspaceLinksCreatedRefCounter,
	],
	async ([
		workspace,
		pageNumber,
		sortBy,
		search,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_refCounter,
	]) => {
		if (!(await workspace)) return { error: true }

		if ((await get(isActiveWorkspaceValid)) === false)
			return { error: true }

		if ((await get(activeWorkspaceDefaultApiKey)) === null)
			return { error: true }

		const { data: response } = await getLinks(
			(await workspace)!.id,
			(await get(activeWorkspaceDefaultApiKey))!.key,
			{
				page: pageNumber.toString(),
				sortBy,
				search,
			},
		)

		if (!response) return { error: true }

		return { data: response.data.data, error: false }
	},
)

export const activeWorkspaceLinksWithExtras = derived(
	activeWorkspaceLinks,
	async (links) => {
		if ((await links).error) return { error: true }

		const data = (await links).data
		const workspaceId = get(activeWorkspaceId)!
		const apiKey = (await get(activeWorkspaceDefaultApiKey))!.key

		return {
			error: false,
			data: {
				...data,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				links: data.links.map((link: any) => ({
					...link,
					statsCount: () =>
						getLinkStatsCount(link.id, workspaceId, apiKey),
				})),
			},
		}
	},
)
