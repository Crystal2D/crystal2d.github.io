#version 300 es

//
// NAME : "Default/Standard"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uColor;

in vec2 vTexturePos;

out vec4 fragColor;

void main ()
{
    fragColor = texture(uSampler, vTexturePos) * uColor;
}