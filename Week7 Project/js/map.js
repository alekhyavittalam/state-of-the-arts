// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 18;
let path = "data/DataMerge_2017.csv";
let markers = L.featureGroup();
let highpollution_markers = L.featureGroup();
let lowpollution_markers = L.featureGroup();

// put this in your global variables
let geojsonPath = 'data/world.json';
let geojson_data;
let geojson_layer;

let brew = new classyBrew();
let fieldtomap;

let legend = L.control({position: 'bottomright'});
let info_panel = L.control();


// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    readCSV(path);
    getGeoJSON(); // read JSON file
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('pop_est') // add a field to be used
	})
}

function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(8);
	brew.setColorCode('YlOrRd');
	brew.classify('quantiles');

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds())

	createLegend();
	createInfoPanel();
}

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8
	}
}


// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

    let circleOptionsHigh = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: '#FF6962',
        fillOpacity: 1,
        //radius: item['Outdoor.air.pollution..IHME..2019.']*100
    }

    let circleOptionsLow = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: '#5EA777',
        fillOpacity: 1,
        //radius: item['Outdoor.air.pollution..IHME..2019.']*100
    }

    $(".sidebar").append(`<div class = "sidebar-item" onclick = "map.flyTo([25.930414, 50.637772], 5)">Bahrain</div>`)
    $(".sidebar").append(`<div class = "sidebar-item" onclick = "map.flyTo([26.820553, 30.802498], 5)">Egypt</div>`)
    $(".sidebar").append(`<div class = "sidebar-item" onclick = "map.flyTo([29.31166, 47.481766], 5)">Kuwait</div>`)
    $(".sidebar").append(`<div class = "sidebar-item" onclick = "map.flyTo([38.963745, 35.243322], 5)">Turkey</div>`)
    $(".sidebar").append(`<div class = "sidebar-item" onclick = "map.flyTo([35.86166, 104.195397], 5)">China</div>`)


data.data.forEach(function(item,index){
    if(item['Outdoor.air.pollution..IHME..2019.'] > 6.00){
        //circleOptions.radius = item['Outdoor.air.pollution..IHME..2019.'] * 100
        //circleOptions.fillColor = 'red'
        let highpollution_marker = L.circleMarker([item.latitude,item.longitude], circleOptionsHigh).bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item['Outdoor.air.pollution..IHME..2019.']}`).on('mouseover',function(){
            this.openPopup()
    })

    highpollution_markers.addLayer(highpollution_marker)

    //add entry to sidebar
    //$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
}

else{
    //circleOptions.radius = item['Outdoor.air.pollution..IHME..2019.'] * 100
    //circleOptions.fillColor = 'green'
    let lowpollution_marker = L.circleMarker([item.latitude,item.longitude], circleOptionsLow).bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item['Outdoor.air.pollution..IHME..2019.']}`).on('mouseover',function(){
        this.openPopup()
})

lowpollution_markers.addLayer(lowpollution_marker)

}

highpollution_markers.addTo(map);
lowpollution_markers.addTo(map);


})

let addLayers = {
    "High Death Rates": highpollution_markers,
    "Low Death Rates": lowpollution_markers,
}

L.control.layers(null,addLayers).addTo(map);

map.fitBounds(lowpollution_markers.getBounds());

}




function flyToIndex(index){
    map.setZoom(5);
    map.panTo(lowpollution_markers.getLayers()[index].getLatLng());
    //markers.getLayers()[index].openPopup()
}


/*
function panToImage(index){
	// zoom to level 17 first
	map.setZoom(17);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);

}
*/


// return the color for each feature
function getColor(d) {

	return d > 1000000000 ? '#800026' :
		   d > 500000000  ? '#BD0026' :
		   d > 200000000  ? '#E31A1C' :
		   d > 100000000  ? '#FC4E2A' :
		   d > 50000000   ? '#FD8D3C' :
		   d > 20000000   ? '#FEB24C' :
		   d > 10000000   ? '#FED976' :
					  '#FFEDA0';
}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);

	info_panel.update(); //resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}

