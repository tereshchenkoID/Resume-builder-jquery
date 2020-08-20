const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints;

 export default isTouchDevice;
