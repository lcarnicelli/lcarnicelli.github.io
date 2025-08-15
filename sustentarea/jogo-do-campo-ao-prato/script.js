window.onload = (e) => {
	const cards = [
		{
			'id': 1,
			'category': '',
			'title': 'Card 1',
			'excerpt': 'Esse é o resumo do primeiro cartão, o texto que está impresso nele.',
			'image': '',
			'text': '',
		},
		{
			'id': 2,
			'category': '',
			'title': 'Card 2',
			'excerpt': 'Some quick example text to build on the card title and make up the bulk of the card’s content.',
			'image': '',
			'text': '',
		},
	];

	const cardsContainer = document.getElementById('cards');
	const cardTemplate = document.getElementById('card-template');
	const cardModal = document.getElementById('card-modal');
	
	cards.forEach((c) => {
		let cardNew = cardTemplate.children[0].cloneNode(true);
		cardNew.querySelector('.card-title').innerHTML = c.title;
		cardsContainer.appendChild(cardNew);
	});

	const urlParams = new URLSearchParams(window.location.search);
	const cardID = urlParams.get('c');

	let cardSelected = cards.find((e) => e.id == cardID);
	cardModal.querySelector('.card-title').innerHTML = cardSelected.title;
	cardModal.querySelector('.card-text').innerHTML = cardSelected.excerpt;

};
