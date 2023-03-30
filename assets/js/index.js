const map = L.map('map'); //.setView([48.415, -109.733], 8)
map.options.minZoom=7;
map.options.maxZoom=12;
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getRegionColor(region) {
    let fillColor = "#7FFFFE";
    if (region == "Region 1") {
        fillColor = "#FFC90D";
    } else if (region == "Region 2") {
        fillColor = "#9AD9EA";
    } else if (region == "Region 3") {
        fillColor = "#FEAEC9";
    } else if (region == "Region 4") {
        fillColor = "#C7BFE6";
    } else if (region == "Region 5") {
        fillColor = "#FEF101";
    } else if (region == "Region 6") {
        fillColor = "#BEC4C9";
    } else if (region == "Region 7") {
        fillColor = "#EFE3AF";
    } else if (region == "Region 8") {
        fillColor = "#B6E41E";
    } else if (region == "Region 9") {
        fillColor = "#F8D1FE";
    } else if (region == "Region 10") {
        fillColor = "#FF7F26";
    } else if (region == "Region 11") {
        fillColor = "#81FF81";
    } else if (region == "Region 12") {
        fillColor = "#7FFFFE";
    } 
    return fillColor;
}

var styleCounty =function(feature, layer){
    return {
        fillColor: getRegionColor(feature.properties.Region),
        fillOpacity: 1,
        color: "#000",
        weight: 1,
        opacity: 1,
    }
}
var styleRegion =function(){
    return {
        fillColor: "#fff",
        fillOpacity: 0,
        color: "#000",
        weight: 2,
        opacity: 1,
    }
}
var styleState =function(){
    return {
        fillColor: "#fff",
        fillOpacity: 0,
        color: "#000",
        weight: 4,
        opacity: 1,
    }
}
var getMarkerStyle = function (feature) {

    return {
        radius: 6,
        fillColor: getColor(feature.properties.StationType),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    }

};

var eachCounty = function(feature, layer){

    layer.bindTooltip(layer.feature.properties.NAME, {
        permanent: true,
        direction: "center",
        opacity: 1,
        className: 'county-label-tooltip'
    });

}

var eachRegion = function(feature, layer){

    layer.bindTooltip(layer.feature.properties.Region, {
        permanent: true,
        direction: "center",
        opacity: 1,
        className: 'region-label-tooltip'
    });

}
var onEachFeature = function (feature, layer) {

    let html = "<b>" + feature.properties.StationID + "</b><br>";
    html += "<b>Name: </b>" + feature.properties.StationName + "</b><br>";
    html += "<b>Office: </b>" + feature.properties.StationOffice + "</b>";
    layer.bindPopup(html);

    layer.on('mouseover', function (e) {
        this.openPopup();
    });

    layer.on('mouseout', function (e) {
        this.closePopup();
    });

    layer.on('click', function (e) {
        window.open(feature.properties.webpage, '_blank');
    })
}
let countyLayer = L.geoJSON(county, {
    style: styleCounty,
    onEachFeature: eachCounty,
    // interactive: false
}).addTo(map);

let regionLayer = L.geoJSON(region, {
    style: styleRegion,
    onEachFeature: eachRegion,
    interactive: false
}).addTo(map);

let stateLayer = L.geoJSON(state, {
    style: styleState,
    interactive: false
    // onEachFeature
}).addTo(map);

map.fitBounds(stateLayer.getBounds());
