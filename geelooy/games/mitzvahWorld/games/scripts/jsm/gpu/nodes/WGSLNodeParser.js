//B"H
import NodeParser from '/games/scripts/jsm/nodes/core/NodeParser.js';
import WGSLNodeFunction from './WGSLNodeFunction.js';

class WGSLNodeParser extends NodeParser {

	parseFunction( source ) {

		return new WGSLNodeFunction( source );

	}

}

export default WGSLNodeParser;
