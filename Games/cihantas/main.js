const gridSize = 15;

const game = document.getElementById('game');

const emojis = ['😀', '😁', '😏', '🤪', '😬'];

const oddIndex = Math.floor(Math.random() * gridSize**2)

do {
	var odd = emojis[Math.floor(Math.random() * emojis.length)];
	var even = emojis[Math.floor(Math.random() * emojis.length)];
} while(even === odd);

for (var i = 1; i <= gridSize**2; i++) {
	const el = document.createElement('span');
	if (i === oddIndex) {
		el.innerText = odd;
		el.addEventListener('click', () => {
			alert('You won!');
			window.location.reload();
		});
	} else {
		el.innerText = even;
	}
	game.appendChild(el);
}