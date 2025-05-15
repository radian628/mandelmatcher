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

uniform float threshold;
uniform float animation_frame;

float sphereDistance(vec3 p) {
  
  float dist = distance(p, vec3(0.0)) - 1.0;
  
  for (float i = 0.0; i < 9.0; i++) {
      float scaleFactor = pow(0.5, i);
      vec3 p2 = mod(p + vec3(animation_frame * 0.001), 0.5 * scaleFactor) - 0.25 * scaleFactor;
      dist = max(dist,
          -(distance(p2, vec3(0.0)) - 0.25 * scaleFactor));
  }
  
  return dist;
}

vec4 raymarch(vec2 bottom_left, vec2 top_right) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = texcoord;

    float range = top_right.x - bottom_left.x;
    vec2 avg = (bottom_left + top_right) * 0.5;

    float rotY = avg.x * -1.0;
    float rotX = avg.y * 1.0;
    
    // vec3 particlePosition = 
    //   vec3(
    //     0.0, 0.0, -1.0 - range 
    //   ) + vec3((bottom_left + top_right) * 0.5, 0.0);

    mat3 rotation_matrix = mat3(
      cos(rotY), 0.0, sin(rotY),
      0.0, 1.0, 0.0,
      -sin(rotY), 0.0, cos(rotY) 
    ) * mat3(
      1.0, 0.0, 0.0,
      0.0, cos(rotX), -sin(rotX),
      0.0, sin(rotX), cos(rotX)
    );

    vec3 particlePosition = vec3(0.0, 0.0, -1.0 - range * 0.5) * rotation_matrix;
    
    vec3 particleDirection = 
        vec3(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, 1.0);
    particleDirection = normalize(particleDirection) * rotation_matrix;
    
    for (int i = 0; i < 64; i++) {
        particlePosition +=
            particleDirection * sphereDistance(particlePosition);
        if (sphereDistance(particlePosition) < 0.001) {
            
            vec3 normal = normalize(
               vec3(
                   sphereDistance(particlePosition + vec3(0.001, 0.0, 0.0))
                       - sphereDistance(particlePosition),
                   sphereDistance(particlePosition + vec3(0.0, 0.001, 0.0))
                       - sphereDistance(particlePosition),
                   sphereDistance(particlePosition + vec3(0.0, 0.0, 0.001))
                       - sphereDistance(particlePosition)
               )
            );

            //fragColor = vec4(dot(normal, vec3(1.0, 0.0, 0.0)), 0.0, 0.0, 1.0);
            return  vec4(vec3(pow(float(i) / 64.0, 0.1)), 1.0);
        }
    }
    
    return vec4(0.0);
    
}

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
    for (i = 0.0; i < iterations && dot(z, z) < threshold; i++) {
      z = vec2(
        z.x * z.x - z.y * z.y,
        2.0 * z.x * z.y
      ) + c;
    }
    return vec4(pow(i / iterations, 1.2), 0.0, 0.0, 0.0);
  } else if (fractal == 2) {
    return raymarch(bottom_left, top_right);
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
