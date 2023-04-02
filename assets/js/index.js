const map = L.map('map'); //.setView([48.415, -109.733], 8)
map.options.minZoom = 7;
map.options.maxZoom = 12;
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

var styleCounty = function (feature, layer) {
    return {
        fillColor: getRegionColor(feature.properties.Region),
        fillOpacity: 1,
        color: "#000",
        weight: 1,
        opacity: 1,
    }
}
var styleRegion = function () {
    return {
        fillColor: "#fff",
        fillOpacity: 0,
        color: "#000",
        weight: 2,
        opacity: 1,
    }
}
var styleState = function () {
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

var eachCounty = function (feature, layer) {

    layer.bindTooltip(layer.feature.properties.NAME, {
        permanent: true,
        direction: "center",
        opacity: 1,
        className: 'county-label-tooltip'
    });

}

var eachRegion = function (feature, layer) {

    layer.bindTooltip(layer.feature.properties.Region1, {
        permanent: true,
        direction: "center",
        opacity: 1,
        className: 'region-label-tooltip'
    });

    let html = "<p style='text-align:center; border-bottom: 1px solid'><b>Event</b></p>";
    html += "<b>" + feature.properties.Region + ", Iowa</b><br>";
    html += "<b>Date: </b>" + feature.properties.Date + "</b><br>";
    html += "<b>Time: </b>" + feature.properties.Time + "</b><br>";
    html += "<b>Location: </b>" + feature.properties.Location + "</b>";
    
    var popup = L.popup();
    popup.setContent(html);
    layer.bindPopup(popup, popupOptions);

    layer.on('mouseover', function (e) {
        var popup = e.target.getPopup();
        popup.setLatLng(e.latlng).openOn(map);
    });

    layer.on('mousemove', function(e) {
        popup.setLatLng(e.latlng).openOn(map);
    });

    layer.on('mouseout', function (e) {
        e.target.closePopup();
    });

}

fetch('assets/data/IowaEvents.csv')
    .then(response => response.text())
    .then(csv => {
        let lines = csv.split('\n');
        let headers = lines[0].split(',');
        headers =  headers.map(str => str.replace(new RegExp(' ', 'g'), ''));
        headers =  headers.map(str => str.replace(new RegExp('\r', 'g'), ''));
        let data = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            data.push(obj);
        }

        const regionJoin = region.features.map(feature => {
            const dataObj = data.find(obj => obj.Region === feature.properties.Region1);
            return { ...feature, properties: { ...feature.properties, ...dataObj } };
        });

        // console.log(regionJoin);

        let countyLayer = L.geoJSON(county, {
            style: styleCounty,
            onEachFeature: eachCounty,
            interactive: false
        }).addTo(map);

        let stateLayer = L.geoJSON(state, {
            style: styleState,
            interactive: false
        }).addTo(map);

        map.fitBounds(stateLayer.getBounds());

        let regionLayer = L.geoJSON(regionJoin, {
            style: styleRegion,
            onEachFeature: eachRegion,
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching CSV file:', error);
    });


