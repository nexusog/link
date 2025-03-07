import {
	PUBLIC_PLAUSIBLE_DOMAIN,
	PUBLIC_PLAUSIBLE_HOST_URL,
} from '$env/static/public'
import Plausible from 'plausible-tracker'

export const plausible = Plausible({
	domain: PUBLIC_PLAUSIBLE_DOMAIN,
	apiHost: PUBLIC_PLAUSIBLE_HOST_URL,
	trackLocalhost: true,
})
