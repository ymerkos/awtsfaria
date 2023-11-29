/**
 * B"H
 */

const {
    loggedIn,
    er
} = require("./general.js");


const {
	detailedPostOperation,
    getPost,
	addPostToHeichel,
	getPostsInHeichel,

} = require("./post.js");


const {
	verifyHeichelAuthority,
	updateHeichel,
	getHeichel,
    getHeichelos,
	deleteHeichel,
    verifyHeichelViewAuthority,
	createHeichel,

} = require("./heichel.js");

const {
	getAllSeriesInHeichel,
	getSeries,
    getSubSeriesInHeichel,
	deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
	addContentToSeries,
} = require("./series.js");

const {
	getAliasesDetails,
    getAliasIDs,
    createNewAlias,
    verifyAliasOwnership,
    verifyAlias,
	getDetailedAlias,
    
    getDetailedAliasesByArray,
	deleteAlias,
    updateAlias,
	getAlias
} = require("./alias.js");

module.exports = {
    getAliasesDetails,
    getAliasIDs,
    createNewAlias,
    verifyAliasOwnership,
    verifyAlias,
	getDetailedAlias,
    
    getDetailedAliasesByArray,
	deleteAlias,
    updateAlias,
	getAlias,


	getAllSeriesInHeichel,
	getSeries,
    getSubSeriesInHeichel,
	deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
	addContentToSeries,


	verifyHeichelAuthority,
	updateHeichel,
	getHeichel,
    getHeichelos,
	deleteHeichel,
    verifyHeichelViewAuthority,
	createHeichel,


	detailedPostOperation,
    getPost,
	addPostToHeichel,
	getPostsInHeichel,


	loggedIn,
    er
};





   
    
