precision mediump float;

varying vec4 fragColor;
varying float vBrightness;
varying vec3 fragNormal;
varying float fragDayLight;

varying vec3 fragViewerDistance;
varying float fragFog;

varying vec3 fragPosition;

varying vec3 fragLightSourceDirection1;
varying float fragLightSourceIntens1;
varying vec3 fragLightCoords1;

varying vec3 fragReflectorTrend1;
varying vec3 fragReflectorCoords1;
varying float fragReflectorIntens1;

varying float fragPhong;
varying float fragBlinn;

void main()
{
    vec3 ambientLightIntensity = vec3(0.1, 0.1, 0.1);
    vec3 sunlightIntensity = vec3(1.0 * fragDayLight, 1.0 * fragDayLight, 1.0 * fragDayLight);
    vec3 sunlightDirection = normalize(vec3(0.0, 10.0, 10.0));

    vec4 texel = fragColor;

    if (fragPhong > 0.0) {
        vec3 lightSourceDirection1 = - fragLightCoords1 + fragPosition;
        float lightSourceIntens1 = 1.0;
        lightSourceIntens1 = 1.0 - 0.06 * length(lightSourceDirection1);
        lightSourceIntens1 = max(lightSourceIntens1, 0.0);

        vec3 lightSourceIntensity1 = vec3(lightSourceIntens1, lightSourceIntens1, lightSourceIntens1);

        vec3 reflectorDirection1 = - fragReflectorCoords1 + fragPosition;
        float reflectorIntens1 = 1.0;
        reflectorIntens1 = 1.0 - 0.06 * length(reflectorDirection1);
        reflectorIntens1 = max(reflectorIntens1, 0.0);
        float reflectorImpact1 = dot(normalize(fragReflectorTrend1), normalize(reflectorDirection1));
        if (reflectorImpact1 < 0.7) reflectorImpact1 = 0.0;
        else reflectorImpact1 = 1.0;

        vec3 reflectorIntensity1 = vec3(reflectorIntens1, reflectorIntens1, reflectorIntens1);

        float n = 5.0;

        vec3 lightIntensity = ambientLightIntensity + 
            (sunlightIntensity * max(0.0, dot(normalize(fragNormal), sunlightDirection))) + 
            (lightSourceIntensity1 * max(0.0, dot(normalize(fragNormal), normalize(lightSourceDirection1)))) + 
            (reflectorIntensity1 * reflectorImpact1 * max(0.0, dot(normalize(fragNormal), normalize(reflectorDirection1)))); 
        if (fragBlinn < 0.0) lightIntensity += 1.0 * (sunlightIntensity * pow(max(0.0, dot(normalize(fragViewerDistance), 
            2.0 * max(0.0, dot(normalize(fragNormal), normalize(sunlightDirection))) * fragNormal - sunlightDirection)), n));
        else lightIntensity += (sunlightIntensity * pow(max(0.0, dot(normalize(fragNormal), 
            normalize((sunlightDirection + fragViewerDistance) / length(sunlightDirection + fragViewerDistance)))), n));
        lightIntensity = vec3(min(1.0, lightIntensity.x), min(1.0, lightIntensity.y), min(1.0, lightIntensity.z));
        texel.xyz *= lightIntensity;
        
        float l = length(fragViewerDistance);
        texel.xyz = max((1800.0 - l * fragFog), 0.0) / 1800.0 * texel.xyz + 
            min(1800.0, l * fragFog) / 1800.0 * vec3(fragDayLight * 0.5, fragDayLight * 0.5, fragDayLight * 0.5);
    }

    gl_FragColor = texel;
}