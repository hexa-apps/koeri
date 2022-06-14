import "../../node_modules/maplibre-gl/dist/maplibre-gl.css";
import "../css/style.css";
import maplibregl from "maplibre-gl";
import axios from "axios";

const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json", // stylesheet location
  center: [34.796, 39.181], // starting position [lng, lat]
  zoom: 5, // starting zoom
});

axios
  .get("http://127.0.0.1:9000/eq/2")
  .then((response) => console.log(response.data));
