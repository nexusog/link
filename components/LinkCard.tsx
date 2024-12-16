'use client'

import { Link } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

function LinkFavicon({ url }: { url: string }) {
	const urlDomain = new URL(url).hostname

	return (
		<Image
			src={`https://icon.horse/icon/${urlDomain}`}
			alt=""
			width={24}
			height={24}
		/>
	)
}

export function LinkCard({ link }: { link: Link }) {
	const redirectUrl = location.host + `/${link.shortName || link.id}`

	return (
		<Card className="w-full rounded-sm shadow-none hover:shadow-sm transition-all">
			<CardContent className="flex p-4 gap-4">
				<div className="flex justify-center items-center">
					<LinkFavicon url={link.url} />
				</div>
				<div className="flex-grow flex flex-col justify-between">
					<a
						href={link.shortName || link.id}
						target="_blank"
						className="text-sm font-semibold tracking-wide hover:underline"
					>
						{redirectUrl}
					</a>
					<a
						href={link.url}
						target="_blank"
						className="text-muted-foreground text-xs hover:underline"
					>
						{link.url}
					</a>
				</div>
			</CardContent>
		</Card>
	)
}
