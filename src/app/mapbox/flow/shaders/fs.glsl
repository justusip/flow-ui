precision highp float;

uniform sampler2D u_vector;
uniform vec2 u_vector_min;
uniform vec2 u_vector_max;
//uniform sampler2D u_color_ramp;

uniform vec4 u_bounds;
uniform vec4 u_data_bounds;

varying vec2 v_particle_pos;

vec2 returnLonLat(float x_domain, float y_domain, vec2 pos) {

    //need value between 0 and 1, which fract accomplishes
    float mercator_x = fract(u_bounds.x + pos.x * x_domain);
    float mercator_y = u_bounds.w + pos.y * y_domain;

    float lon = mercator_x * 360.0 - 180.0;
    float lat2 = 180.0 - mercator_y * 360.0;
    float lat = 360.0 / 3.141592654 * atan(exp(lat2 * 3.141592654/180.0)) - 90.0;

    return vec2(lon, lat);
}

void main() {

    //convert from 0-1 to degrees for proper texture value lookup
    float x_domain = abs(u_bounds.x - u_bounds.z);
    float y_domain = abs(u_bounds.y - u_bounds.w);

    vec2 coordinate = returnLonLat(x_domain, y_domain, v_particle_pos);
    float lon = coordinate.x;
    float lat = coordinate.y;

    //discard if out of bounds
    if (
    lat > u_data_bounds.w || lat < u_data_bounds.y ||
    lon > u_data_bounds.z || lon < u_data_bounds.x
    ) {
        discard;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.33);
}