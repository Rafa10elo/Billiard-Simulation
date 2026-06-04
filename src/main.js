import {SceneRenderer} from './Renderer/sceneRenderer.js'

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('poolTable');
  if (container) {
    const sceneRenderer = new SceneRenderer(container); 
  }
});