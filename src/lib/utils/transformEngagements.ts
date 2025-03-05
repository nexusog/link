type EngagementEvent = [number, string]

export function transformEngagementsIntoDateCount(
	data: EngagementEvent[],
): [Date, number][] {
	const map = new Map<string, number>()

	for (const [timestamp] of data) {
		const dateStr = new Date(timestamp).toDateString()
		map.set(dateStr, (map.get(dateStr) || 0) + 1)
	}

	return Array.from(map.entries()).map(([dateStr, count]) => [
		new Date(dateStr),
		count,
	])
}
