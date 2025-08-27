import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { PUBLIC_API_BASE_URL } from '$env/static/public'

export const load: PageServerLoad = (event) => {
	const { params, url } = event

	const { linkId } = params

	const type = url.searchParams.has('qr') ? 'QR' : 'CLICK'

	return redirect(
		307,
		`${PUBLIC_API_BASE_URL}/links/${linkId}/redirect${type === 'QR' ? '?qr' : ''}`,
	)
}
