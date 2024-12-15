import axios from 'axios'
import { env } from './env'

const client = axios.create({
	baseURL: env.NEXT_PUBLIC_API_BASE_URL,
	validateStatus: () => true,
})

export function createWorkspace(name: string) {
	return client.post('/workspaces', {
		name: name.trim(),
	})
}
