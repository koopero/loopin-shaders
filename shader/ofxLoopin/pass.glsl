/*
  Render multi-pass.
  Enabled by patching integer to render/NAME/passes
*/
uniform int passIndex; // Integer index of pass
uniform int passTotal; // Total passes
uniform float passDensity; // 1.0 / passTotal
uniform float passX; // passIndex / passTotal
