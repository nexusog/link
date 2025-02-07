import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	client: {
		NEXT_PUBLIC_API_BASE_URL: z.string().url().min(1),
		NEXT_PUBLIC_PLAUSIBLE_HOST_URL: z.string().url().min(1),
		NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
		NEXT_PUBLIC_PLAUSIBLE_HOST_URL:
			process.env.NEXT_PUBLIC_PLAUSIBLE_HOST_URL,
		NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
	},
	emptyStringAsUndefined: true,
})
