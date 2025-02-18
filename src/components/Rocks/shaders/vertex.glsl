#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 csm_vPositionW;
varying vec3 csm_vNormalW;

void main() {
  
  vUv = uv;
  csm_vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
  csm_vNormalW = normalize(mat3(modelMatrix) * normal);

}