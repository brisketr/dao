<script lang="ts">

	let amount = 0;

	function stake() {
		
	}

</script>

<h2>Genesis Exchange - Stake</h2>

<table>
	<tr>
		<td>Amount (BRIB)</td>
		<td class="number"><input type=number value={amount} min=0 /></td>
	</tr>

	<tr>
		<td />
		<td class="number">
			<button on:click={stake}>Stake</button>
		</td>
	</tr>
</table>

<style>
	table {
		table-layout: fixed;
	}

	table td {
		border-collapse: collapse;
		border: 1px solid white;
		padding: 1em;
	}

	td.number {
		text-align: right;
	}

	td.wrap {
		overflow-wrap: break-word;
	}
</style>
