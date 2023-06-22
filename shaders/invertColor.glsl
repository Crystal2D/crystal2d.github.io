//
// NAME : "Default/Invert Color"
// TYPE : FRAGMENT
//

precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTexturePosition;

void main ()
{
    vec4 texColor = texture2D(uSampler, vTexturePosition);
    
    gl_FragColor = vec4(1.0 - texColor.r, 1.0 - texColor.g, 1.0 - texColor.b, texColor.a);
}