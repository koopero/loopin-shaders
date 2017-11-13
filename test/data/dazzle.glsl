#version 150

#include "ofxLoopin/clock.glsl"
#include "ofxLoopin/src.glsl"


#ifdef SHADER_TYPE_VERT
/*
  Matrix and mesh supplied by openframeworks.
*/
uniform mat4 modelViewProjectionMatrix;
in vec4 position;
in vec2 texcoord;
in vec4 color;
in vec4 normal;

/*
  Outputs supplied to fragment shader by loopin convention.
*/
out vec2 srcCoord;
out vec4 vertColour;

/*
  The actual vertex shader.
*/
void main()
{
  // Use supplied texture coordinates.
  srcCoord = vec2(texcoord.x, texcoord.y);
  // Multiply them by srcMatrix
  srcCoord = (srcMatrix*vec4(srcCoord.x,srcCoord.y,0,1)).xy;

  // Default to multiplying by white.
  vertColour = vec4(0.25,0,1,1);

  vec4 pos = position;
  pos.xy *= 0.5;
  gl_Position = modelViewProjectionMatrix * pos;
}
#endif

#ifdef SHADER_TYPE_FRAG
/*
  Inputs supplied by vertex shader by loopin convention.
*/
in vec2 srcCoord;
in vec4 vertColour;

/*
  Default output.
*/
out vec4 outputColour;

/*
  The default shader is pretty simple...
*/
void main()
{
  outputColour = texture(srcSampler, srcCoord);
  outputColour += vertColour;
}
#endif
