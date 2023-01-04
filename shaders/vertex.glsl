//
// NAME : "Default/Standard"
// TYPE : VERTEX
//

uniform mat3 uLocalMatrix;
uniform vec2 uVertexPositionOffset;

varying vec2 vTexturePosition; 

attribute vec2 aVertexPosition;
attribute vec2 aTexturePosition;

void main ()
{
    gl_Position = vec4(uLocalMatrix * vec3(aVertexPosition + uVertexPositionOffset, 1), 1);
    
    vTexturePosition = aTexturePosition;
}