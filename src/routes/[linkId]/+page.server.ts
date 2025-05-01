import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { PUBLIC_SECONDARY_FRONTEND_URL } from '$env/static/public'

export const load: PageServerLoad = (event) => {
	const { params, url } = event

	const { linkId } = params

	const type = url.searchParams.has('qr') ? 'QR' : 'CLICK'

	// permanent redirect to secondary frontend
	return redirect(
		301,
		`${PUBLIC_SECONDARY_FRONTEND_URL}/${linkId}${type === 'QR' ? '?qr' : ''}`,
	)
}
