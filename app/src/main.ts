import App from './App.svelte';
import { connectWeb3 } from './web3/connect';
import { connected } from './web3/stores';

// If the user has connected before, then connect web3.
if (localStorage.getItem('connected')) {
	connectWeb3();
}

connected.subscribe(connected => {
	// If connected, store the connected state in localStorage.
	if (connected) {
		localStorage.setItem('connected', 'true');
	} else {
		localStorage.removeItem('connected');
	}
});

const app = new App({
	target: document.body,
	props: {}
});

export default app;
