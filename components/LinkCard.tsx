'use client'

import { Link, LinkStats, LinkStatsDataPoint } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { getLinkStats } from '@/lib/api'
import { activeWorkspaceIdAtom, defaultActiveApiKeyAtom } from '@/lib/state'
import { useAtomValue } from 'jotai'

import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'

type ProcessedDataPoint = { date: string; redirects: number }

// Utility to process data points
const useGetDataPoints = (dataPoints: LinkStatsDataPoint[]) => {
	const processDataPoints = useCallback((): ProcessedDataPoint[] => {
		// Helper to format a timestamp into DD/MM
		const formatDate = (timestamp: number): string => {
			const date = new Date(timestamp)
			const day = String(date.getDate()).padStart(2, '0')
			const month = String(date.getMonth() + 1).padStart(2, '0')
			return `${day}/${month}`
		}

		// Generate an array of the last 7 days
		const today = new Date()
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(today)
			date.setDate(today.getDate() - i)
			return formatDate(date.getTime())
		}).reverse()

		// Aggregate redirects per date
		const dateMap = dataPoints.reduce<Record<string, number>>(
			(acc, [timestamp]) => {
				const date = formatDate(timestamp)
				acc[date] = (acc[date] || 0) + 1
				return acc
			},
			{},
		)

		// Fill missing dates with 0 redirects
		return last7Days.map((date) => ({
			date,
			redirects: dateMap[date] || 0,
		}))
	}, [dataPoints])

	return processDataPoints
}

// LinkTinyChart Component
const LinkTinyChart = ({
	dataPoints,
}: {
	dataPoints: LinkStatsDataPoint[]
}) => {
	const getDataPoints = useGetDataPoints(dataPoints)
	const chartData = useMemo(() => getDataPoints(), [getDataPoints])

	console.log(chartData)

	return (
		<div className="relative w-full h-full max-h-[20px]">
			<div className="text-gray-500 text-xs mb-2">
				{chartData[0]?.date} to {chartData[6]?.date}
			</div>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={chartData}
					margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
				>
					{/* Tooltip */}
					<Tooltip
						cursor={{ stroke: '#8884d8', strokeWidth: 1 }}
						wrapperClassName="bg-white rounded z-10 text-xs !p-1"
					/>

					{/* Area */}
					<Area
						type="monotone"
						dataKey="redirects"
						stroke="#8884d8"
						fill="#8884d8"
						strokeWidth={2}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

function LinkFavicon({ url }: { url: string }) {
	const urlDomain = new URL(url).hostname

	return (
		<Image
			src={`https://icon.horse/icon/${urlDomain}`}
			className="rounded-full"
			alt=""
			width={24}
			height={24}
		/>
	)
}

export function LinkCard({ link }: { link: Link }) {
	const redirectUrl = location.host + `/${link.shortName || link.id}`
	const activeWorkspaceId = useAtomValue(activeWorkspaceIdAtom)
	const defaultActiveApiKey = useAtomValue(defaultActiveApiKeyAtom)
	const [stats, setStats] = useState<LinkStats | null>(null)

	useEffect(() => {
		if (!activeWorkspaceId || !defaultActiveApiKey) return

		getLinkStats(link.id, activeWorkspaceId, defaultActiveApiKey.key).then(
			({ data }) => {
				setStats(data?.data?.data?.engagements || null)
			},
		)
	}, [link.id, activeWorkspaceId, defaultActiveApiKey])

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
				<div>{stats && <LinkTinyChart dataPoints={stats} />}</div>
			</CardContent>
		</Card>
	)
}
