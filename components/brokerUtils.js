/**
* T4Utils.brokerUtils - Broker Utils namespace for T4
* @version v1.0.0
* @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
* @author Ben Margevicius
* @date April 4, 2016
* Copyright 2016. MIT licensed.
*/
/* jshint strict: false */
/**
* Security namespace declaration
*/
T4Utils.brokerUtils = T4Utils.brokerUtils || {};

/**
* Processes a t4 tag.
* @param {string} t4Tag - HTML style T4 tag that needs to be processed. Typically something from the media library.
* @return {string} A string value of the t4 tag output. Depends on the formatters you put in.
*/
T4Utils.brokerUtils.processT4Tag = function (t4Tag) {
    var context = (typeof content !== 'undefined') ? content : null;
    return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, context, language, isPreview, t4Tag);
};
