#version 300 es

//
// NAME : "DEP/Tinted"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uTint;

in vec2 vTexturePos;
in vec4 vColor;

out vec4 fragColor;

void main ()
{
    fragColor = texture(uSampler, vTexturePos) * vColor + uTint;
}