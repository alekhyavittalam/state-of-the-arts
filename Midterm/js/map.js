// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/DataMerge_2017.csv";
//let markers = L.featureGroup();
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

    let circleOptions = {
        radius: 15,
        weight: 1,
        color: 'white',
        fillColor: null,
        fillOpacity: 1,
        //radius: item['Outdoor.air.pollution..IHME..2019.']*100
    }

    /*
    //loop through each entry
    data.data.forEach(function(item,index){
        let marker = L.circleMarker([item.latitude,item.longitude], circleOptions).on('mouseover',function(){
            this.bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item['Outdoor.air.pollution..IHME..2019.']}`).openPopup()
        })

        markers.addLayer(marker)

        //add entry to sidebar
        //$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
    })

    markers.addTo(map);

    map.fitBounds(markers.getBounds());
}
*/ 

data.data.forEach(function(item,index){
    if(item['Outdoor.air.pollution..IHME..2019.'] > 6.00){
        circleOptions.radius = item['Outdoor.air.pollution..IHME..2019.'] * 100
        circleOptions.fillColor = 'red'
        let highpollution_marker = L.circleMarker([item.latitude,item.longitude], circleOptions).bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item['Outdoor.air.pollution..IHME..2019.']}`).on('mouseover',function(){
            this.openPopup()
    })

    highpollution_markers.addLayer(highpollution_markers)

    //add entry to sidebar
    //$('.sidebar').append(`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`)
}

else{
    circleOptions.radius = item['Outdoor.air.pollution..IHME..2019.'] * 100
    circleOptions.fillColor = 'green'
    let lowpollution_marker = L.circleMarker([item.latitude,item.longitude], circleOptions).bindPopup(`${item.country}<br> Percentage of Deaths due to Pollution: ${item['Outdoor.air.pollution..IHME..2019.']}`).on('mouseover',function(){
        this.openPopup()
})

lowpollution_markers.addLayer(lowpollution_markers)

}

highpollution_markers.addTo(map);
lowpollution_markers.addTo(map);

})

let addLayers = {
    "High Pollution": highpollution_markers,
    "Low Pollution": lowpollution_markers,
}

map.fitBounds(lowpollution_markers.getBounds());
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

