/**
 * B"H
 */

var {
    loggedIn,
    er
} = require("./general.js");

var {
	addComment,
	getComments,
	getComment,
	deleteComment,
	editComment
} = require("./comment.js");

var {
	detailedPostOperation,
    getPost,
	addPostToHeichel,
	getPostsInHeichel,

} = require("./post.js");


var {
	verifyHeichelAuthority,
	updateHeichel,
	getHeichel,
    getHeichelos,
	deleteHeichel,
    verifyHeichelViewAuthority,
	createHeichel,
	getHeichelEditors

} = require("./heichel.js");

var {
	getAllSeriesInHeichel,
	getSeries,
    getSubSeriesInHeichel,
	deleteContentFromSeries,
    deleteSeriesFromHeichel,
    editSeriesDetails,
    makeNewSeries,
	addContentToSeries,
} = require("./series.js");

var {
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
    
	
	addComment,
	getComments,
	getComment,
	deleteComment,
	editComment,

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
	getHeichelEditors,


	detailedPostOperation,
    getPost,
	addPostToHeichel,
	getPostsInHeichel,


	loggedIn,
    er
};





   
    
