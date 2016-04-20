/**
 * T4Utils.elementInfo - elementInfo namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */
 
/* jshint strict: false */
/**
* elementInfo namespace declaration
*/
T4Utils.elementInfo = T4Utils.elementInfo || {};

/**
*	Get all of the elements within the piece of content
*	@return {ContentElement[]} An array containing the elements within the piece of content.

Removing this until it works. 

T4Utils.elementInfo.getElements = function() {
	var c = content || null;
	if(c !== null) {
		c.getElements();	
	}
	else {
		return null;
	}
};
*/	

/**
*	If the element is "text", get its' "publish" value as a String.
*	@param {string} element - The string value of the name of the element
*	@return {string} The value of the element. Can be null if the supplied value is already null.
*/
T4Utils.elementInfo.getElementValue = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{
		var el = c.get(element); //returns a contentelement type
		if(typeof el.publish === "function")
		{
			return el.publish();	
		}
	}	
	return null;
};	

/**
*	Used to get the name of the element.
*	@param {string} element - The string value of the name of the element
*	@return {string} The name of the element
*/ 
T4Utils.elementInfo.getElementName = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{	
		var el = c.get(element);
		if(typeof el.getName === "function")
		{
			return c.get(element).getName();	
		}			
	}
	return null;
};

/**
*	Used to get the ID of the element.
*	@param {string} element - The string value of the name of the element
*	@return {string} The ID of the element
*/
T4Utils.elementInfo.getElementID = function(element) 
{
	var c = content || null; 
	if(c !== null)
	{
		var el = c.get(element); //Returns a CachedContent type?
		if(typeof el.getID === "function")
		{
			return el.getID();
		}			
	}
	return null;
};	