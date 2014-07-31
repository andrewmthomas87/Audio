
var numberChannels = 50;

var colors = ['#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1'];

var audio, context, analyser, source;
audio = new Audio();
audio.controls = false;
audio.loop = true;
audio.autoplay = true;

function animate() {
	var fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	for (i = 0; i < numberChannels; i++) {
		$('div div:nth-child(' + (i + 1) + ')').height(Math.floor(fbc_array[i] * $(window).height() / 400));
		$('div div:nth-child(' + (i + 1) + ')').css('opacity', (fbc_array[i] / 255));
	}
}

function changeColor() {
	$('div div').css('background-color', colors[Math.floor(Math.random() * colors.length)]);
}

function resize() {
	for (i = 0; i < numberChannels; i++) {
		$('div div:nth-child(' + (i + 1) + ')').css('left', i * $(window).width() / numberChannels);
	}
	$('div div').width($(window).width() / numberChannels);
}

$(document).ready(function() {
	for (i = 0; i < numberChannels; i++) {
		$('body>div').append('<div></div>');
	}
	resize();
	$('span#drop').on('dragover', function(jQueryEvent) {
		var event = jQueryEvent.originalEvent;
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	});
	$('span#drop').on('drop', function(jQueryEvent) {
		var event = jQueryEvent.originalEvent;
		event.stopPropagation();
		event.preventDefault();
		var file = event.dataTransfer.files[0];
		if (!file.type.match('audio.*')) {
			return false;
		}
		var reader = new FileReader();
		console.log('Reading file');
		reader.onload = (function(audioFile) {
			return function(e) {
				console.log('Read file');
				audio.src = e.target.result;
				document.body.appendChild(audio);
				context = new webkitAudioContext();
				analyser = context.createAnalyser();
				source = context.createMediaElementSource(audio);
				source.connect(analyser);
				analyser.connect(context.destination);
				setInterval(animate, 15);
				setInterval(changeColor, 1000);
			};
		})(file);
	});
});
