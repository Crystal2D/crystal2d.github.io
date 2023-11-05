#version 300 es

//
// NAME : "Default/Standard"
// TYPE : VERTEX
//

uniform mat3 uMatrix;

layout(location = 0) in vec2 aVertexPos;
layout(location = 1) in vec2 aTexturePos;

out vec2 vTexturePos;

void main ()
{
    gl_Position = vec4(uMatrix * vec3(aVertexPos, 1), 1);
    
    vTexturePos = aTexturePos;
}