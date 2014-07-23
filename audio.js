
var numberChannels = 50;

var maximumFrequency = 0;

var audio, context, analyser, source;
audio = new Audio();
audio.src = 'Why-Am-I-The-One.m4a';
audio.controls = false;
audio.loop = true;
audio.autoplay = true;

function animate() {
	var fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	for (i = 0; i < numberChannels; i++) {
		if (fbc_array[i] > maximumFrequency) {
			maximumFrequency = fbc_array[i];
		}
		$('div div:nth-child(' + (i + 1) + ')').height(fbc_array[i]);
		$('div div:nth-child(' + (i + 1) + ')').css('opacity', (fbc_array[i] / maximumFrequency));
	}
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
	document.body.appendChild(audio);
	context = new webkitAudioContext();
	analyser = context.createAnalyser();
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	setInterval(animate, 15);
});
