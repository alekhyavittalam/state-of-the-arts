// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/DataMerge_2017.csv";
let markers = L.featureGroup();

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

    let circleOptions = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: 'dodgerblue',
        fillOpacity: 1,
        //radius: item.Outdoor_Air_Pollution
    }
    //loop through each entry
    data.data.forEach(function(item,index){
        let marker = L.circleMarker([item.latitude,item.longitude], circleOptions).on('mouseover',function(){
            this.bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item.Outdoor_Air_Pollution}`).openPopup()
        })
//Percentage for Outdoor Air Pollution is not working?????????????

        markers.addLayer(marker)

        //add entry to sidebar
        //$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
    })

    markers.addTo(map);

    map.fitBounds(markers.getBounds());
}


//Add clickable buttons to each country?

/*
function panToImage(index){
	// zoom to level 17 first
	map.setZoom(17);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);

}
*/

