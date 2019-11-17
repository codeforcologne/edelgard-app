import iconPlace from "../../assets/icon-place.png";
import iconPlaceSelected from "../../assets/icon-place-selected.png";
import iconPlaceUnavailable from "../../assets/icon-place-unavailable.png";
import iconCone from "../../assets/cone.svg";
import iconConeGray from "../../assets/cone-gray.svg";

const iconPlaceImage = new Image();
iconPlaceImage.src = iconPlace;
const iconPlaceSelectedImage = new Image();
iconPlaceSelectedImage.src = iconPlaceSelected;
const iconPlaceUnavailableImage = new Image();
iconPlaceUnavailableImage.src = iconPlaceUnavailable;
const iconConeImage = new Image(200, 200);
iconConeImage.src = iconCone;
const iconConeGrayImage = new Image(200, 200);
iconConeGrayImage.src = iconConeGray;

const images = [
  ["icon-place", iconPlaceImage],
  ["icon-place-selected", iconPlaceSelectedImage],
  ["icon-place-unavailable", iconPlaceUnavailableImage],
  ["icon-cone", iconConeImage],
  ["icon-cone-gray", iconConeGrayImage],
];

export default images;
