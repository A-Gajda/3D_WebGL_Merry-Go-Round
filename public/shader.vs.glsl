precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
//attribute vec2 vertTexCoord;
attribute vec3 normal;

//varying vec2 fragTexCoord;
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
varying float fragReflectorIntens1;
varying vec3 fragReflectorCoords1;

varying float fragPhong;
varying float fragBlinn;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mNormal;
uniform vec4 colorVec;
uniform bool ifColorVec;
uniform float dayLight;

uniform float fog;

uniform vec3 lightCoords1;

uniform vec3 reflectorCoords1;
uniform float angle;

uniform bool phong;
uniform bool blinn;

//const vec3 lightDirection = normalize(vec3(0, 7.0, 5.0));

void main()
{
    if (phong) fragPhong = 1.0;
    else fragPhong = -1.0;

    if (blinn) fragBlinn = 1.0;
    else fragBlinn = -1.0;

    if (phong) {

        fragNormal = normalize((mNormal * vec4(normalize(normal), 0.0)).xyz);
        fragDayLight = dayLight;
        if (ifColorVec) fragColor = vec4(colorVec);
        else fragColor = vec4(vertColor, 1.0);
        fragPosition = (mWorld * vec4(vertPosition, 1.0)).xyz;
        fragFog = fog;
        fragViewerDistance = - (mView * mWorld * vec4(vertPosition, 1.0)).xyz;
        fragLightCoords1 = lightCoords1;
        fragReflectorCoords1 = reflectorCoords1;
        fragReflectorTrend1 = vec3((50.0 - angle) * 0.02, 1.0, 0.0);

    }

    else {
    //vec3 worldNormal = (mNormal * vec4(normal, 1.0)).xyz;
    /* vec3 worldNormal = (mWorld * vec4(normal, 0.0)).xyz;
    float diffuse = max(0.0, dot(worldNormal, lightDirection));
    vBrightness = diffuse; */

        vec3 ambientLightIntensity = vec3(0.1, 0.1, 0.1);
        vec3 sunlightIntensity = vec3(1.0 * dayLight, 1.0 * dayLight, 1.0 * dayLight);
        vec3 sunlightDirection = normalize(vec3(0.0, 10.0, 10.0));

        vec3 normal = normalize((mNormal * vec4(normalize(normal), 0.0)).xyz);
        vec4 texel;
        if (ifColorVec) texel = vec4(colorVec);
        else texel = vec4(vertColor, 1.0);

        vec3 position = (mWorld * vec4(vertPosition, 1.0)).xyz;

        vec3 lightSourceDirection1 = - lightCoords1 + position;
        float lightSourceIntens1 = 1.0;
        lightSourceIntens1 = 1.0 - 0.06 * length(lightSourceDirection1);
        lightSourceIntens1 = max(lightSourceIntens1, 0.0);
        vec3 lightSourceIntensity1 = vec3(lightSourceIntens1, lightSourceIntens1, lightSourceIntens1);

        vec3 reflectorTrend1 = vec3((50.0 - angle) * 0.02, 1.0, 0.0);
        vec3 reflectorDirection1 = - reflectorCoords1 + position;
        float reflectorIntens1 = 1.0;
        reflectorIntens1 = 1.0 - 0.06 * length(reflectorDirection1);
        reflectorIntens1 = max(reflectorIntens1, 0.0);
        float reflectorImpact1 = dot(normalize(reflectorTrend1), normalize(reflectorDirection1));
        if (reflectorImpact1 < 0.7) reflectorImpact1 = 0.0;
        else reflectorImpact1 = 1.0;
        vec3 reflectorIntensity1 = vec3(reflectorIntens1, reflectorIntens1, reflectorIntens1);

        vec3 viewerDistance = - (mView * mWorld * vec4(vertPosition, 1.0)).xyz;
        float l = length(viewerDistance);

        float n = 5.0;

        vec3 lightIntensity = ambientLightIntensity + 
            (sunlightIntensity * max(0.0, dot(normalize(normal), sunlightDirection))) + 
            (lightSourceIntensity1 * max(0.0, dot(normalize(normal), normalize(lightSourceDirection1)))) + 
            (reflectorIntensity1 * reflectorImpact1 * max(0.0, dot(normalize(normal), normalize(reflectorDirection1))));
        if (!blinn) lightIntensity += 1.0 * (sunlightIntensity * pow(max(0.0, dot(normalize(viewerDistance), 
            2.0 * max(0.0, dot(normalize(normal), normalize(sunlightDirection))) * normal - sunlightDirection)), n));
        else lightIntensity += (sunlightIntensity * pow(max(0.0, dot(normalize(normal), 
            normalize((sunlightDirection + viewerDistance) / length(sunlightDirection + viewerDistance)))), n));
        lightIntensity = vec3(min(1.0, lightIntensity.x), min(1.0, lightIntensity.y), min(1.0, lightIntensity.z));
        texel.xyz *= lightIntensity;

        texel.xyz = max((1800.0 - l * fog), 0.0) / 1800.0 * texel.xyz + 
            min(1800.0, l * fog) / 1800.0 * vec3(dayLight * 0.5, dayLight * 0.5, dayLight * 0.5);

        fragColor = texel;

    }

    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}