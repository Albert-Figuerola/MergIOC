let icones = {
	'aigua': ['fa-droplet', 'fa-glass-water', 'fa-bottle-water', 'fa-truck-droplet'],
	'foc': ['fa-fire', 'fa-fire-burner', 'fa-bacon', 'fa-burger']
}
$(document).ready(function () {
	//******************** EAC5: E1 ***********************//
	//Creem la icona del volcà sense usar jQuery
	let divVolca = document.createElement('div');
	divVolca.setAttribute('genera', 'foc');
	let volca = document.createElement('i');
	volca.classList.add('fa-solid', 'fa-volcano');
	divVolca.appendChild(volca);
	document.getElementById('tauler').firstElementChild.firstElementChild.appendChild(divVolca);

	//Creem la icona del núvol usant jQuery
	$('#tauler').children()
		.last()
		.children()
		.first()
		.append($(`<span genera='aigua'>
							<i class='fa-solid fa-cloud-rain'></i>
						</span>`));

	//******************** EAC5: E2 ***********************//

	//$('#tauler').find('.fa-volcano').on('click', crearNouElement);
	//$('#tauler').find('.fa-cloud-rain').on('click', crearNouElement);	
	$('#tauler').children().children().on('click', crearNouElement);

	function crearNouElement(e) {
		let $elemClic = $(this);
		// Exercici 1, si la casella conté un element, entrem
		if ($elemClic.children().length > 0) {
			let nomClasse = $elemClic.last().children().children()[0].className,
				element = nomClasse.split(" ");
			element = element[1];
			console.log(element);
			//Creem element
			let novaClass = $elemClic.last().children().attr('genera');

			// Exercici 1, com la casella conté un element, fem la crida AJAX
			if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ 
				httpRequest = new XMLHttpRequest();
				console.log("Creat l'objecte a partir de XMLHttpRequest.");
			} else if (window.ActiveXObject) { // IE 6 i anteriors
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				console.log("Creat l'objecte a partir de ActiveXObject.");
			} else {
				console.error("Error: Aquest navegador no suporta AJAX.");
			}

			httpRequest.open('GET', 'https://merge.lallardeldrac.cat?elem=' + element, true);
			httpRequest.send(null);

			// Exercici 2, creació de l'element rebut al XML
			httpRequest.onreadystatechange = () => {
				//console.log("Ha canviat l'estat de la petició", httpRequest.readyState);
				let resposta = httpRequest.responseXML;
				// Si la resposta és diferent a nulla, o la llargada es major de 30, introduïm casella al tauler
				if (resposta != null && httpRequest.responseText.length > 30) {
					let icona = resposta.documentElement.childNodes[0].textContent;
					retornaCasellaBuida().append($('<div><i class="fa-solid ' + icona + '" draggable="true" tipus="' + novaClass + '" nivell="0"></i></div>'));
				}
			};
		}
	}

	//Funció que retorna una casella buida com a objecte jQuery
	function retornaCasellaBuida() {
		let x;
		let y;
		let casella;
		for (let i = 0; i < 42; i++) {
			x = Math.floor(Math.random() * 7);
			y = Math.floor(Math.random() * 6);
			$casella = $('#tauler').children().eq(y).children().eq(x);
			if (!$casella.children().length) {
				return $casella;
			}
		}
	}

	//******************** EAC5: E3 ***********************//
	let elementArrossegat;
	let caselles = document.getElementsByClassName('col');
	for (let i = 0; i < caselles.length; i++) {
		caselles[i].addEventListener('dragstart', function (e) {
			elementArrossegat = e.target;
			elementArrossegat.style.opacity = 0.4;
		});

		caselles[i].addEventListener('drop', function (e) {
			let tipus1 = elementArrossegat.getAttribute('tipus');
			let tipus2 = e.target.getAttribute('tipus');
			let nivell1 = elementArrossegat.getAttribute('nivell');
			let nivell2 = e.target.getAttribute('nivell');
			elementArrossegat.style.opacity = 1;

			// Exercici 3, si els elements tenen la mateixa classe i el mateix nivell, entrem
			if ((tipus1 == tipus2) && (nivell1 == nivell2) && (elementArrossegat != e.target)) {
				nivell = parseInt(nivell1) + 1;

				// Exercici 3, com tenen la mateixa classe, es realitza crida AJAX per canviar l'element
				let classeTarget = e.target.className.split(" "),
					classe = classeTarget[1];

				if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ 
					httpRequest = new XMLHttpRequest();
				} else if (window.ActiveXObject) { // IE 6 i anteriors
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} else {
					console.error("Error: Aquest navegador no suporta AJAX.");
				}

				httpRequest.open('GET', 'https://merge.lallardeldrac.cat?merge=' + classe, true);
				httpRequest.send(null);

				// Exercici 4, creació de l'element rebut al XML
				// Si la resposta és diferent a nulla, o la llargada es major de 30, creem l'element nou rebut a la crida AJAX
				httpRequest.onreadystatechange = () => {
					//console.log("Ha canviat l'estat de la petició", httpRequest.readyState);
					let resposta = httpRequest.responseXML;
					if (resposta != null && httpRequest.responseText.length > 30) {
						let icona = resposta.documentElement.childNodes[0].textContent;
						elementArrossegat.parentNode.remove();
						elementArrossegat.remove();
						e.target.setAttribute('nivell', nivell);
						e.target.classList.remove(classe);
						e.target.classList.add(icona);
					}
				};
			};

		});

		caselles[i].addEventListener('dragover', function (e) {
			e.preventDefault();
		});
	}
});