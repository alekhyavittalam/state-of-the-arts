// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/DataMerge_2017.csv";
let markers = L.featureGroup();
let highpollution_markers = L.featureGroup();
let lowpollution_markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
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
        fillColor: 'red',
        fillOpacity: 1,
        //radius: item['Outdoor.air.pollution..IHME..2019.']*100
    }

    let circleOptionsLow = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: 'green',
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
    "High Pollution": highpollution_markers,
    "Low Pollution": lowpollution_markers,
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

