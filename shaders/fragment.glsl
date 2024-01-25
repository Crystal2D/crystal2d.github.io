#version 300 es

//
// NAME : "Default/Standard"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;

in vec2 vTexturePos;
in vec4 vColor;

out vec4 fragColor;

void main ()
{
    fragColor = texture(uSampler, vTexturePos) * vColor;
}