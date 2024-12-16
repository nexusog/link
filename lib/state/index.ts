import { atom } from 'jotai'
import { ApiKey, WorkspaceInStorage } from '../types'
import { atomWithStorage } from 'jotai/utils'
import { getApiKeys } from '../api'

export const loadingAtom = atom(false)

export const workspacesAtom = atomWithStorage<WorkspaceInStorage[]>(
	'workspaces',
	[],
)

export const activeWorkspaceIdAtom = atomWithStorage<string | null>(
	'activeWorkspace',
	null,
)

export const isNoWorkspaceAtom = atom((get) => {
	return get(workspacesAtom).length === 0
})

export const activeWorkspaceAtom = atom(
	(get) =>
		get(workspacesAtom).find((w) => w.id === get(activeWorkspaceIdAtom)) ||
		null,
)

export const isHydratedAtom = atom(false)

export const activeApiKeysAtom = atom<Promise<ApiKey[] | null>>(async (get) => {
	const activeWorkspace = get(activeWorkspaceAtom)

	if (!activeWorkspace) {
		return null
	}

	const { data: apiKeys, error: GetApiKeysError } = await getApiKeys(
		activeWorkspace.id,
		activeWorkspace.secret,
	)

	if (GetApiKeysError) {
		return null
	}

	if (apiKeys.data.data.length === 0) {
		return null
	}

	return apiKeys.data.data.apiKeys
})

export const defaultActiveApiKeyAtom = atom<Promise<ApiKey | null>>(
	async (get) => {
		const activeApiKeys = await get(activeApiKeysAtom)

		if (!activeApiKeys) {
			return null
		}

		const defaultApiKey = activeApiKeys?.find(
			(apiKey) => apiKey.label === 'Default',
		)

		if (!defaultApiKey) {
			return null
		}

		return defaultApiKey
	},
)
