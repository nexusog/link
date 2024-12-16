import axios, { AxiosError, type AxiosResponse } from 'axios'
import { env } from './env'
import { until } from '@open-draft/until'

const client = axios.create({
	baseURL: env.NEXT_PUBLIC_API_BASE_URL,
})

type Response = {
	error: boolean
	message: string
	data: never
}

export function createWorkspace(name: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.post('/workspaces', {
			name,
		}),
	)
}
