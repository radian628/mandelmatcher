#version 300 es

precision highp float;

in vec2 vertex_position;

out vec2 texcoord;

uniform vec2 resolution;

void main(void) {
  gl_Position = vec4(vertex_position, 0.5, 1.0);
  texcoord = vertex_position * 0.5 * vec2(resolution.x / resolution.y, 1.0) + 0.5;
}
