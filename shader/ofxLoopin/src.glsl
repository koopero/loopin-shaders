/*
  Texture
  Since the default texture is named `src`, this is used as the prefix.
*/
uniform sampler2D srcSampler; // GLSL Sampler
uniform mat4 srcMatrix;   // Matrix to use for texture. Currently unity.
uniform int srcWidth;   // Pixel width of the texture's buffer.
uniform int srcHeight; //  Pixel height of the texture's buffer.
uniform int srcCols;  // `cols` metadata from the texture's buffer.
uniform int srcRows; //  `rows` metadata from the texture's buffer.
