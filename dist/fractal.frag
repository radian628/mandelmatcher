#version 300 es

precision highp float;

in vec2 texcoord;

out vec4 fragColor;

uniform vec2 user_params;
uniform vec2 user_bottom_left;
uniform vec2 user_top_right;

uniform vec2 target_params;
uniform vec2 target_bottom_left;
uniform vec2 target_top_right;

uniform int fractal;
uniform float iterations;
uniform float hue_offset;

vec4 get_fractal_value(vec2 params, vec2 bottom_left, vec2 top_right, vec2 _coord) {
  vec2 coord = _coord * (top_right - bottom_left) + bottom_left;

  // julia set
  if (fractal == 0) {
    vec2 c = params;
    vec2 z = coord;
    float i = 0.0;
    for (i = 0.0; i < iterations && dot(z, z) < 4.0; i++) {
      z = vec2(
        z.x * z.x - z.y * z.y,
        2.0 * z.x * z.y
      ) + c;
    }
    return vec4(pow(i / iterations, 0.75), 0.0, 0.0, 0.0);
  
  // mandelbrot set
  } else if (fractal == 1) {
    vec2 c = coord;
    vec2 z = vec2(0.0);

    float i = 0.0;
    for (i = 0.0; i < iterations && dot(z, z) < 4.0; i++) {
      z = vec2(
        z.x * z.x - z.y * z.y,
        2.0 * z.x * z.y
      ) + c;
    }
    return vec4(pow(i / iterations, 1.2), 0.0, 0.0, 0.0);
  }

  return vec4(0.0);
}

float PI = 3.14159265;

vec3 sinhue(float hue) {
  return vec3(
    sin(2.0 * PI * hue),
    sin(2.0 * PI * (hue + 0.33333333)),
    sin(2.0 * PI * (hue + 0.66666667))
  ) * 0.15 + 0.5;
}

void main(void) {
  vec4 user_fractal_color = 
      get_fractal_value(user_params, user_bottom_left, user_top_right, texcoord);
  vec4 target_fractal_color = 
      get_fractal_value(target_params, target_bottom_left, target_top_right, texcoord);
  // float value = 
  //   user_fractal_color.x + target_fractal_color.x 
  //   - user_fractal_color.x * target_fractal_color.x * 2.0; 

  float value1 = user_fractal_color.x;
  float value2 = target_fractal_color.x;


  vec3 value = abs(
    sinhue(value1 + hue_offset * 1.23456) * value1 * value1 * 2.0 - sinhue(value2 - hue_offset) * value2 * value2 * 2.0
    // vec3(value1 * 4.0, value1 * 2.0, value1)
    // - vec3(value2 * 1.0, value2 * 2.0, value2 * 4.0)
  );

  fragColor = 
    vec4(
      value,
      1.0
    );
}
