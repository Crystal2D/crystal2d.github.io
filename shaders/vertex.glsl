#version 300 es

//
// NAME : "Default/Standard"
// TYPE : VERTEX
//

uniform mat3 uMatrix;

layout(location = 0) in vec2 aVertexPos;
layout(location = 1) in vec2 aTexturePos;
layout(location = 2) in vec4 aColor;

out vec2 vTexturePos;
out vec4 vColor;

void main ()
{
    gl_Position = vec4(uMatrix * vec3(aVertexPos, 1), 1);
    
    vTexturePos = aTexturePos;
    vColor = aColor;
}