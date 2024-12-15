import { WorkspaceInStorage } from '../types'
import { atomWithStorage } from 'jotai/utils'

export const workspacesAtom = atomWithStorage<WorkspaceInStorage[]>(
	'workspaces',
	[],
)
