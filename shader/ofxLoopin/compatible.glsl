#ifdef SHADER_VERSION_150
#define Texture texture
#ifdef SHADER_TYPE_FRAG
out vec4 OUT;
#define Var in
#endif
#ifdef SHADER_TYPE_VERT
#define Var out
#endif
#endif
#ifdef SHADER_VERSION_ES
#define Texture texture2d
#define Var varying
#ifdef SHADER_TYPE_FRAG 
#define OUT gl_FragColor
#endif
#endif
