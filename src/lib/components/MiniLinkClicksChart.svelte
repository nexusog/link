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
				mapsTo: 'value',
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

<AreaChart
	data={data.map((d) => ({
		date: d[0],
		value: d[1],
	}))}
	{options}
/>
