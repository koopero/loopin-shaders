#version 150
// keyword dazzle

#include "ofxLoopin/clock.glsl"
#include "ofxLoopin/src.glsl"
#include "noise.glsl"

#ifdef SHADER_TYPE_VERT
#include "ofxLoopin/vert.glsl"

void main()
{
  // Use supplied texture coordinates.
  srcCoord = vec2(texcoord.x, texcoord.y);
  // Multiply them by srcMatrix
  srcCoord = (srcMatrix*vec4(srcCoord.x,srcCoord.y,0,1)).xy;

  // Default to multiplying by white.
  vertColour = vec4(1,1,1,1);

  vec4 pos = position;
  pos.xy *= 0.5;
  gl_Position = modelViewProjectionMatrix * pos;
}
#endif

#ifdef SHADER_TYPE_FRAG
#include "ofxLoopin/frag.glsl"

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
  outputColour += vertColour * vec4( 0.3, 0.3, 0.5, 1.0 );
  outputColour.r = noise( vec3( srcCoord.x, srcCoord.y, clockTime ) * vec3( 20, 20, 0.25 ) );
}
#endif
