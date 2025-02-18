#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 csm_vPositionW;
varying vec3 csm_vNormalW;

uniform float uTime;
uniform float uWaterLevel;
uniform float uWaveSpeed;
uniform float uWaveAmplitude;
uniform float uFoamDepth;
uniform vec3 uMossColor;

void main() {
    
    vec3 baseColor = csm_DiffuseColor.rgb;

    // Moss Color
    float mossFactor = smoothstep(uWaterLevel + 0.3, uWaterLevel - 0.05, csm_vPositionW.y);
    baseColor = mix(baseColor, uMossColor, mossFactor);

    // Foam Effect
    // Modify the y position based on sine function, oscillating up and down over time
    float sineOffset = sin(uTime * uWaveSpeed) * uWaveAmplitude;

    // The current dynamic water height
    float currentWaterHeight = uWaterLevel + sineOffset;

    float stripe = smoothstep(currentWaterHeight + 0.01, currentWaterHeight - 0.01, csm_vPositionW.y)
                 - smoothstep(currentWaterHeight + uFoamDepth + 0.01, currentWaterHeight + uFoamDepth - 0.01, csm_vPositionW.y);

    vec3 stripeColor = vec3(1.0, 1.0, 1.0); // White stripe

    
    vec3 finalColor = mix(baseColor - stripe, stripeColor, stripe);
    
    // Output the final color
    csm_DiffuseColor = vec4(finalColor, 1.0);
    
}