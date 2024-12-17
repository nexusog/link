import { env } from '@/lib/env'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const type = req.nextUrl.searchParams.has('qr') ? 'QR' : 'CLICK'
	const id = (await params).id
	redirect(
		`${env.NEXT_PUBLIC_API_BASE_URL}/links/${id}/redirect?type=${type}`,
	)
}
