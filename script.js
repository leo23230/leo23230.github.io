import videojs from '/video.js';
import '/videojs-vr';

const player = videojs('my-video');

// Initialize the VR plugin
player.vr({
  projection: '360',  // The projection type: '360', 'EAC' (equirectangular), or 'Cube'
  debug: false,       // Set to true for debugging output
  forceCardboard: false,  // Use Google Cardboard mode
  nativeControlsForTouch: false, // Use native controls on touch devices
  // Other configurations for stereoscopic, 3D, etc.
});