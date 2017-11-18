#include "vert.glsl"
#include "src.glsl"

void main()
{
  // Use supplied texture coordinates.
  srcCoord = vec2(texcoord.x, texcoord.y);
  // Multiply them by srcMatrix
  srcCoord = (srcMatrix*vec4(srcCoord.x,srcCoord.y,0,1)).xy;

  // Default to multiplying by white.
  vertColour = vec4(1,1,1,1);

  // Output position.
  gl_Position = modelViewProjectionMatrix * position;
}
