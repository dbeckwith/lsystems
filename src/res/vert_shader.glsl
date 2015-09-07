attribute vec3 vPosition;

uniform mat4 transform;

void main() {
    gl_Position = transform * vec4(vPosition, 1.0);
}
