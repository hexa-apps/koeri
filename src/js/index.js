import "../../node_modules/maplibre-gl/dist/maplibre-gl.css";
import "../css/style.css";
import maplibregl from "maplibre-gl";
import axios from "axios";

const sourceID = "eq-src",
  layerID = "eq-lyr";
let sourceData = [],
  time = "0";

let popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
});

const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json", // stylesheet location
  center: [34.796, 39.181], // starting position [lng, lat]
  zoom: 4, // starting zoom
});

/**
 * @param {object} props
 * @param {string} props.time
 */
const fetchEqData = async (props) => {
  const response = await axios.get("http://127.0.0.1:9000/eq/" + props.time);
  return response.data;
};

/**
 * @param {object} props
 * @param {string} props.sourceID
 * @param {Array} props.sourceData
 * @param {string} props.layerID
 */
const createLayer = (props) => {
  map.addSource(props.sourceID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: props.sourceData },
  });
  map.addLayer({
    id: props.layerID,
    source: props.sourceID,
    type: "circle",
    paint: {
      "circle-stroke-width": 1,
      "circle-stroke-color": "#001517",
      "circle-color": [
        "step",
        ["get", "depth"],
        "#C30303",
        6,
        "#FF0000",
        11,
        "#FF7F01",
        21,
        "#FBE955",
        41,
        "#74FB55",
        81,
        "#33DAE9",
      ],
      "circle-radius": [
        "step",
        ["get", "mag"],
        8,
        2,
        10,
        3,
        12,
        4,
        14,
        5,
        16,
        6,
        18,
        7,
        20,
        8,
        22,
      ],
    },
  });
};

/**
 * @param {object} props
 * @param {string} props.time
 * @param {string} props.sourceID
 */
const updateData = async (props) => {
  const data = await fetchEqData({ time: props.time });
  map.getSource(props.sourceID).setData({
    type: "FeatureCollection",
    features: data,
  });
};

const mapOnLoad = (e) => {
  createLayer({ sourceID, sourceData, layerID });
  updateData({ time, sourceID });
  setInterval(() => {
    updateData({ time, sourceID });
  }, 120000);
  map.on("click", () => {
    popup.remove();
  });
  map.on("click", layerID, (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    const html =
      "<h3>" +
      properties.location +
      "</h3><h4>Büyüklük</h4><p>" +
      properties.mag +
      "</p>" +
      "<h4>Derinlik</h4><p>" +
      properties.depth +
      "</p>";
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup.setLngLat(coordinates).setHTML(html).addTo(e.target);
  });
  map.on("mouseenter", layerID, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", layerID, () => {
    map.getCanvas().style.cursor = "";
  });
};

map.on("load", mapOnLoad);
