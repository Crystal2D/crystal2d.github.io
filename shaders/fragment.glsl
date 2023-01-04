//
// NAME : "Default/Standard"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTexturePosition;

void main ()
{
    gl_FragColor = texture2D(uSampler, vTexturePosition);
}