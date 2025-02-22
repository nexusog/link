import { getWorkspace } from './api'

export async function isWorkspaceValid(
	workspaceId: string,
	workspaceSecret: string,
) {
	const { error, data } = await getWorkspace(workspaceId, workspaceSecret)

	return Boolean(error) || Boolean(data?.data?.error) ? false : true
}
