//=================================================================================
// Indal Composition Style & Classique
// LE Ngoc-Duy-Vu 2012
//=================================================================================

imagePath = "images/"

init();
function init() {
	loadArray = new Array('luminaires', 'crosses');
	for (var i = loadArray.length - 1; i >= 0; i--) {
		loadXml(loadArray[i]);
	}
}

// Chargement des XML
// Exemple :
// luminairesArray[0] = id: "jargeau", nom: "Jargeau", src: "jargeau_main.png"
// luminairesArray[0][0] = id: "jargeau_cl113", nom: "CL113, src: "jargeau_cl113.png", s: "1", p: "1", l: "0"
// luminairesArray[0]['crosses'][0] = id: "beaugency", s: "1", p: "0", l: "0"
//===================================================================================
function loadXml(file) {
	window[file + 'Array'] = new Array();
	$.get('xml/' + file + '.xml', 
			function(data) {
				var i = 0;
				var arr = new Array();
				var node = file.slice(0, -1);
				$(data).find(node).each(function() {
					arr[i] = new Array();
					arr[i]['id'] = $(this).attr('id');
					arr[i]['nom'] = $(this).attr('nom');
					arr[i]['src'] = $(this).attr('src');
					var modeles = $('modele', $(this));
					for (var m = 0, l = modeles.length; m < l; m++) {
						arr[i][m] = new Array();
						arr[i][m]['id'] = modeles[m].getAttribute('id');								// id
						arr[i][m]['nom'] = modeles[m].getAttribute('nom');						// nom
						arr[i][m]['src'] = modeles[m].getAttribute('src');							// référence à l'image
						if (file == "luminaires") {																	// FIXATIONS
							arr[i][m]['s'] = modeles[m].getAttribute('s');								// suspendu
							arr[i][m]['p'] = modeles[m].getAttribute('p');								// porté
							arr[i][m]['l'] = modeles[m].getAttribute('l');								// lyre
						} else if (file == "crosses") {															// OFFSET
							arr[i][m]['xM'] = parseInt(modeles[m].getAttribute('xM'));		// fixation au mât sur l'axe horizontal
							arr[i][m]['yM'] = parseInt(modeles[m].getAttribute('yM'));		// fixation au mât sur l'axe vertical
							arr[i][m]['xL'] = parseInt(modeles[m].getAttribute('xL'));			// fixation au luminaire sur l'axe horizontal
							arr[i][m]['yL'] = parseInt(modeles[m].getAttribute('yL'));			// fixation au luminaire sur l'axe vertical
						}
					};
					if (file == "luminaires") {
						var crosses  = $('crosse', $(this));
						arr[i]['crosses'] = new Array();
						for (var c = 0, l = crosses.length; c < l; c++) {
							arr[i]['crosses'][c] = new Array();
							arr[i]['crosses'][c]['id'] = crosses[c].getAttribute('id');
							arr[i]['crosses'][c]['s'] = crosses[c].getAttribute('s');
							arr[i]['crosses'][c]['p'] = crosses[c].getAttribute('p');
							arr[i]['crosses'][c]['l'] = crosses[c].getAttribute('l');
						}
					}
					console.log(arr[i]);
					i++;
				});
				window[file + 'Array'] = arr;
	});
}