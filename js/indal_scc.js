//=================================================================================
// Indal Composition Style & Classique
// LE Ngoc-Duy-Vu 2012
//=================================================================================

imagePath = "images/";
imageSize = 100;
luminairesSelect = "";
crossesSelect = "";
nbList = 0;
indList = 0;


init();
function init() {
	loadArray = new Array('luminaires', 'crosses');
	for (var i = loadArray.length - 1; i >= 0; i--) {
		loadXml(loadArray[i]);
	}
	$('#luminairesSelect').on({
		click: function() {
			/*var $cont = $('#listes .luminaires ul');
			$cont.animate({
				left: parseInt($cont.css('left'), 10) == 0 ? -$cont.outerWidth()-10 : 0
			});*/
		}
	});
	$('#crossesSelect').on({
		click: function() {
			/*var $cont = $('#listes .crosses ul');
			$cont.animate({
				left: parseInt($cont.css('left'), 10) == 0 ? -$cont.outerWidth()-10 : 0
			});*/
		}
	});
}

function start() {
	for (var i = loadArray.length - 1; i >= 0; i--) {
		//$('#listes .' + loadArray[i] + ' ul').css('left', parseInt(-$('#listes .' + loadArray[i] + ' ul').outerWidth()));
		$('#' + loadArray[i] + 'Select').trigger('click');
	}
	resize();
}

function resize() {
	var docW = $(document).width();
	var docH = $(document).height();
	var margeM = 100;
	var tabW = $('.tab').width();
	
	var $main = $('#main');
	var $continset = $('#main .continset');
	var $title = $('#title');
	var $choix = $('#choix');
	var $listes = $('#listes');
	var $preview = $('#preview');
	var $output = $('#output');
	
	var headerH = $('header').height();
	var pageW = docW - margeM - $choix.width() - (2 * tabW) - 20;
	var pageH = ($('.luminaires').outerHeight() * 4) - 10;
	
	$main.css({
		'width':	docW - margeM,
		'height':	pageH + $title.height(),
		'left':		margeM / 2,
		'top':		margeM / 2
	});
	
	$continset.css({
		'width':	pageW + $choix.width() + (2 * tabW) + 20,
		'height':	pageH
	});
	
	$choix.css('height', pageH - 20);
	
	$listes.css({
		'left': 		$choix.width() + 20,
		'top': 		$title.height(),
		'width': 	pageW,
		'height':	pageH
	});
	$('.cont', $listes).css({
		'width': 	pageW - 60,
		'height':	pageH
	});
	$('.tab', $listes).css('height',	pageH);
	
	$preview.css({
		'left': 		$choix.width() + 20 + tabW,
		'top': 		$title.height(),
		'width': 	pageW,
		'height':	pageH
	});
	$('.cont', $preview).css({
		'width': 	pageW - 60,
		'height':	pageH
	});
	$('.tab', $preview).height(pageH);
	
	$output.css({
		'left': 		$choix.width() + 20 + (2 * tabW),
		'top': 		$title.height(),
		'width': 	pageW,
		'height':	pageH
	});
	$('.cont', $output).css({
		'width': 	pageW - 60,
		'height':	pageH
	});
	$('.tab', $output).height(pageH);
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
					//console.log(arr[i]);
					i++;
					nbList++;
				});
				window[file + 'Array'] = arr;
				if (file == "luminaires") {
					loadItems("luminaires");
				} else  if (file == "crosses") {
					loadItems("crosses");
				}
	});
}

// Chargement des produits
function loadItems(file) {
	for (var i = 0, c = window[file + 'Array'].length; i < c; i++) {
		var item = "<li class='" + file + "Item'><div class='inner loading'></div><div class='" + file + "SubItem'></div></li>";
		$('#listes .' + file + ' ul').append(item);
		$('li:eq(' + i + ')', $('#listes .' + file + ' ul')).on({
			mouseenter:  function() {
				$('.' + file + 'SubItem', this).fadeIn();
			},
			mouseleave: function() {
				$('.' + file + 'SubItem', this).fadeOut();
			}
		});
	}
	var $fileLi = $('#listes .' + file + ' li');
	loadItemImg($fileLi, 0);

	
	// Chargement des images
	function loadItemImg(li, l1) {
		var el = $(li).eq(l1);
		var img = new Image();
		var imgW = imgH = 0;
		$(img)
			.load(function() {																	// Applique la taille
				imgW = resizeImg(this, "width", 1);
				imgH = resizeImg(this, "height", 1);
				$(this).hide();																		// Cache temporairement
				var $inner = $('.inner', el);													
				$inner.removeClass('loading').append(this);						// Retire le chargement
				$(this).attr('width', imgW).attr('height', imgH).fadeIn();	// Faire apparaître l'image
			})
			.error(function() { console.log('erreur : ' + el); })
			.attr('src', imagePath + window[file + 'Array'][l1]['src'])		// Source de l'image
			.attr('alt', window[file + 'Array'][l1]['id']);								// Alt de l'image
		loadSubItemImg(li, l1, 0);
		l1++;
		indList++;
		if(file == "luminaires" && indList == nbList) { start(); }
		if(l1 < li.length) { loadItemImg(li, l1); }
	}
	
	// Chargement des images sub
	function loadSubItemImg(li, l1, l2) {
		var $subItem = $('.' + file + 'SubItem', $('#listes .' + file + ' li:eq(' + l1 + ')'));
		var img = new Image();
		var imgW = imgH = 0;
		$(img)
			.load(function() {																	// Applique la taille
				imgW = resizeImg(this, "width", 2);
				imgH = resizeImg(this, "height", 2);
				$(this).hide();																		// Cache temporairement		
				$subItem.append("<div class='subInner loading'></div>");
				var $inner = $('.subInner:last', $subItem);								
				$inner.removeClass('loading').append(this);						// Retire le chargement
				$inner.on({
					mouseenter:  function() {
						$(this).stop().animate({ backgroundColor: '#CCC' });
					},
					mouseleave: function() {
						$(this).stop().animate({ backgroundColor: '#FFF' });
					},
					click: function() {
						var $sel = $('#' + file + 'Select .inner');
						var imgS = new Image();
						var imgSW = imgSH = 0;
						$sel.empty();
						$subItem.fadeOut();
						/*var $cont = $('#listes .' + file + ' ul');
						$cont.animate({
							left: parseInt($cont.css('left'), 10) == 0 ? -$cont.outerWidth()-10 : 0
						});*/
						$(imgS)
							.load(function() {
								imgSW = resizeImg(this, "width", 1);
								imgSH = resizeImg(this, "height", 1);
								$(this).hide();
								$sel.removeClass('loading').append(this);
								$(this).attr('width', imgSW).attr('height', imgSH).fadeIn();
							})
							.error(function() { console.log('erreur : ' + $selImg) })
							.attr('src', $('img', this).attr('src'))
							.attr('alt', $('img', this).attr('alt'));
					}
				});
				$(this).attr('width', imgW).attr('height', imgH).fadeIn();	// Faire apparaître l'image
			})
			.error(function() { console.log('erreur : ' + $subItem); })
			.attr('src', imagePath + window[file + 'Array'][l1][l2]['src'])	// Source de l'image
			.attr('alt', window[file + 'Array'][l1][l2]['id']);							// Alt de l'image
		l2++;
		if(l2 == window[file + 'Array'][l1].length) { $subItem.css('width', 70 * l2); }
		if(l2 < window[file + 'Array'][l1].length) { loadSubItemImg(li, l1, l2); }
	}
}

// Fonction Size
function resizeImg(img, size, ratio) {
	var imgW = imgH = 0;
	if(img.width <= img.height) {
		imgH = (imageSize / ratio);
		imgW = (img.width * (imageSize / ratio)) / img.height;
		$(img).css('padding-top', '10px');
	} else {
		imgW = (imageSize / ratio);
		imgH = (img.height * (imageSize / ratio)) / img.width;
		var pad = (((imageSize / ratio) - imgH) / 2) + 10;
		$(img).css('padding-top', pad + 'px');
	}
	if(size == "width") {
		return imgW;
	} else {
		return imgH;
	}
}

