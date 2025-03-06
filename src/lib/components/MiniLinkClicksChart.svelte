<script lang="ts">
	import {
		AreaChart,
		ScaleTypes,
		type AreaChartOptions,
	} from '@carbon/charts-svelte'
	import '@carbon/charts-svelte/styles.min.css'

	type Props = {
		data: [Date, number][]
	}

	let { data }: Props = $props()

	let formattedData = $derived(
		data.map((d) => ({
			date: d[0].toISOString(),
			clicks: d[1],
			group: 'Total Clicks',
		})),
	)

	const options: AreaChartOptions = {
		width: '150px',
		grid: {
			x: {
				enabled: false,
			},
			y: {
				enabled: false,
			},
		},
		axes: {
			bottom: {
				visible: false,
				title: 'Date',
				mapsTo: 'date',
				scaleType: ScaleTypes.TIME,
			},
			left: {
				visible: false,
				title: 'Clicks',
				mapsTo: 'clicks',
				scaleType: ScaleTypes.LINEAR,
			},
		},
		color: {
			gradient: {
				enabled: true,
			},
		},
		points: {
			enabled: false,
		},
		toolbar: {
			enabled: false,
		},
		legend: {
			enabled: false,
		},
	}
</script>

<AreaChart data={formattedData} {options} />
