uniform mat4 modelViewProjectionMatrix;
#ifdef SHADER_VERSION_150
in vec4 position;
in vec2 texcoord;
in vec4 color;
in vec4 normal;
out vec2 srcCoord;
out vec4 vertColour;
#endif
#ifdef SHADER_VERSION_ES
attribute vec4 position;
attribute vec2 texcoord;
attribute vec4 color;
attribute vec4 normal;
varying vec2 srcCoord;
varying vec4 vertColour;
#endif
