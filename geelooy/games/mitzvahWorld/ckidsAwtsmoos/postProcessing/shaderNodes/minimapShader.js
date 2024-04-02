/**B"H
 * 
 */
// Three.js Transpiler r163

import { uniform, vec3, dot, float, radians, tan, depth, vec2, tslFn, length, normalize, If, cos, sin, mat2, sub, vec4, mix, int, distance, loop } from 'three/nodes';

const opacity = uniform( 'float' );
const tDiffuse = uniform( 'sampler2D' );
/* unknown statement */;
const cameraPos = uniform( 'vec3' );
const cameraDirection = uniform( 'vec3' );
const cameraFOV = uniform( 'float' );
const cameraAspect = uniform( 'float' );
define;
const objectColors = uniform( 'vec3' );
const numberOfDvarim = uniform( 'int' );
const playerPos = uniform( 'vec3' );
const playerRot = uniform( 'float' );
const minimapRadius = uniform( 'float' );

const calculateMinimapPosition = tslFn( ( [ worldPos_immutable ] ) => {

	const worldPos = vec3( worldPos_immutable ).toVar();
	const relativePosition = vec3( worldPos.sub( cameraPos ) ).toVar();
	const depth = float( dot( relativePosition, cameraDirection ) ).toVar();
	const fovFactor = float( tan( radians( cameraFOV ).div( 2.0 ) ) ).toVar();
	const aspectFactor = float( cameraAspect ).toVar();
	const adjustedX = float( relativePosition.x.div( depth ).div( fovFactor.mul( aspectFactor ) ) ).toVar();
	const adjustedZ = float( relativePosition.z.div( depth ).negate().div( fovFactor.mul( aspectFactor ) ) ).toVar();

	return vec2( adjustedX, adjustedZ );

} );

const normalizeVec2 = tslFn( ( [ v_immutable ] ) => {

	const v = vec2( v_immutable ).toVar();
	const r = vec2( vec2( v.add( 1.0 ) ).div( 2.0 ) ).toVar();

	return r;

} );

const clampToCircle = tslFn( ( [ position_immutable ] ) => {

	const position = vec2( position_immutable ).toVar();
	const radius = float( 0.5 ).toVar();
	const circleSpacePos = vec2( position.sub( vec2( 0.5, 0.5 ) ) ).toVar();
	const dst = float( length( circleSpacePos ) ).toVar();

	If( dst.greaterThan( radius ), () => {

		circleSpacePos.assign( normalize( circleSpacePos ).mul( radius ) );

	} );

	return circleSpacePos.add( vec2( 0.5, 0.5 ) );

} );

const isPointInRotatedTriangle = tslFn( ( [ point_immutable, center_immutable, rotation_immutable, size_immutable ] ) => {

	const size = float( size_immutable ).toVar();
	const rotation = float( rotation_immutable ).toVar();
	const center = vec2( center_immutable ).toVar();
	const point = vec2( point_immutable ).toVar();
	const p1 = vec2( vec2( 0.0, - 1.0 ).mul( size ) ).toVar();
	const p2 = vec2( vec2( - 0.866, 0.5 ).mul( size ) ).toVar();
	const p3 = vec2( vec2( 0.866, 0.5 ).mul( size ) ).toVar();
	const cosA = float( cos( rotation ) ).toVar();
	const sinA = float( sin( rotation ) ).toVar();
	mat2.assign( mat2( cosA, sinA.negate(), sinA, cosA ) );
	p1.assign( rot.mul( p1 ) );
	p2.assign( rot.mul( p2 ) );
	p3.assign( rot.mul( p3 ) );
	p1.addAssign( center );
	p2.addAssign( center );
	p3.addAssign( center );
	const alpha = float( p2.y.sub( p3.y ).mul( point.x.sub( p3.x ) ).add( p3.x.sub( p2.x ).mul( point.y.sub( p3.y ) ) ).div( p2.y.sub( p3.y ).mul( p1.x.sub( p3.x ) ).add( p3.x.sub( p2.x ).mul( p1.y.sub( p3.y ) ) ) ) ).toVar();
	const beta = float( p3.y.sub( p1.y ).mul( point.x.sub( p3.x ) ).add( p1.x.sub( p3.x ).mul( point.y.sub( p3.y ) ) ).div( p2.y.sub( p3.y ).mul( p1.x.sub( p3.x ) ).add( p3.x.sub( p2.x ).mul( p1.y.sub( p3.y ) ) ) ) ).toVar();
	const gamma = float( sub( 1.0, alpha.sub( beta ) ) ).toVar();

	return alpha.greaterThan( 0.0 ).and( beta.greaterThan( 0.0 ).and( gamma.greaterThan( 0.0 ) ) );

} );

const isPointInCircle = tslFn( ( [ point_immutable, center_immutable, radius_immutable ] ) => {

	const radius = float( radius_immutable ).toVar();
	const center = vec2( center_immutable ).toVar();
	const point = vec2( point_immutable ).toVar();

	return length( point.sub( center ) ).lessThan( radius );

} );

const main = tslFn( () => {

	const borderSize = float( 0.01 ).toVar();
	const texel = vec4( texture2D( tDiffuse, uUv ) ).toVar();
	const v = vec2( calculateMinimapPosition( playerPos ) ).toVar();
	const u = vec2( normalizeVec2( v ) ).toVar();
	const triangleSize = float( 0.05 ).toVar();
	const triangleColor = vec4( 0.0, 0.0, 1.0, 0.5 ).toVar();
	const outerTriangleSize = float( triangleSize.add( borderSize ) ).toVar();
	const cosA = float( cos( playerRot.negate() ) ).toVar();
	const sinA = float( sin( playerRot.negate() ) ).toVar();
	mat2.assign( mat2( cosA, sinA.negate(), sinA, cosA ) );
	const frontPoint = vec2( rot.mul( vec2( 0.0, - 0.03 ) ) ).toVar();
	const frontPointPosition = vec2( u.add( frontPoint ) ).toVar();
	const circleRadius = float( 0.01 ).toVar();
	const circleColor = vec4( 1.0, 1.0, 1.0, 0.5 ).toVar();

	If( isPointInRotatedTriangle( uUv, u, playerRot.negate(), outerTriangleSize ), () => {

		If( isPointInRotatedTriangle( uUv, u, playerRot.negate(), triangleSize ).not(), () => {

			texel.assign( vec4( 0.0, 0.0, 0.0, 1.0 ) );

		} ).else( () => {

			texel.assign( mix( texel, triangleColor, triangleColor.a ) );

		} );

	} );

	If( isPointInCircle( uUv, frontPointPosition, circleRadius ), () => {

		texel.assign( vec4( 1.0, 1.0, 1.0, 1.0 ) );

	} );

	loop( { start: int( 0 ), end: numberOfDvarim }, ( { i } ) => {

		v.assign( calculateMinimapPosition( objectPositions.element( i ) ) );
		u.assign( normalizeVec2( v ) );
		u.assign( clampToCircle( u ) );
		const dist = float( distance( uUv, u ) ).toVar();

		If( dist.lessThan( 0.03 ), () => {

			texel.assign( vec4( 1.0, 1.0, 0.0, 1.0 ) );

		} );

	} );

	gl_FragColor.assign( opacity.mul( texel ) );

} );

// layouts

calculateMinimapPosition.setLayout( {
	name: 'calculateMinimapPosition',
	type: 'vec2',
	inputs: [
		{ name: 'worldPos', type: 'vec3' }
	]
} );

normalizeVec2.setLayout( {
	name: 'normalizeVec2',
	type: 'vec2',
	inputs: [
		{ name: 'v', type: 'vec2' }
	]
} );

clampToCircle.setLayout( {
	name: 'clampToCircle',
	type: 'vec2',
	inputs: [
		{ name: 'position', type: 'vec2' }
	]
} );

isPointInRotatedTriangle.setLayout( {
	name: 'isPointInRotatedTriangle',
	type: 'bool',
	inputs: [
		{ name: 'point', type: 'vec2' },
		{ name: 'center', type: 'vec2' },
		{ name: 'rotation', type: 'float' },
		{ name: 'size', type: 'float' }
	]
} );

isPointInCircle.setLayout( {
	name: 'isPointInCircle',
	type: 'bool',
	inputs: [
		{ name: 'point', type: 'vec2' },
		{ name: 'center', type: 'vec2' },
		{ name: 'radius', type: 'float' }
	]
} );

main.setLayout( {
	name: 'main',
	type: 'void',
	inputs: []
} );

export { opacity, tDiffuse, cameraPos, cameraDirection, cameraFOV, cameraAspect, objectColors, numberOfDvarim, playerPos, playerRot, minimapRadius, calculateMinimapPosition, normalizeVec2, clampToCircle, isPointInRotatedTriangle, isPointInCircle, main };
