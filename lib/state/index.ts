import { atom } from 'jotai'
import { WorkspaceInStorage } from '../types'
import { atomWithStorage } from 'jotai/utils'

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
