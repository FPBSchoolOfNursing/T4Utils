/**
 * t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * Copyright 2016. MIT licensed.
 * Built: Tue Apr 19 2016 10:28:49 GMT-0400 (EDT).
 */
/**
 * Java dependencies -
 * @version v1.0.3
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 14, 2016
 * Copyright 2016. MIT licensed.
 */
/* jshint strict: false */
/* Java Language */
importPackage(java.lang);
/* getSectionInfo.js */
importClass(com.terminalfour.publish.PathBuilder);
/* media.js */
importPackage(com.terminalfour.media);
importPackage(com.terminalfour.media.utils);
/* ordinalIndicators.js */
importClass(com.terminalfour.sitemanager.cache.utils.CSHelper);
importClass(com.terminalfour.sitemanager.cache.CachedContent);
importPackage(com.terminalfour.sitemanager);
importPackage(com.terminalfour.content);

/*  Versioning    
	6/24/2015 - Initial
	6/30/2015 - Added stuff from T4's javascript util (https://community.terminalfour.com/forum/index.php?topic=426.0)
				Added utils.version;
				Added utils.siteManager namespace 
				Added utils.siteManager.version, and utils.siteManager.buildDetails;
				Added utils.brokerUtils namespace
				Added utils.brokerUtils.processT4Tags
	7/1/2015	Added utils.console(method, textOrObj) used to write debugging statements to the console.
	7/2/2015 	Added utils.elementInfo namspace to return info about elements 
				Added utils.elementInfo.getElements to return an array of elements
				Added utils.elementInfo.getElementValue(element) to return the value of an element. 
	7/6/2015	Added utils.elementInfo.getElementName(element).
	7/8/2015	Added newline chars for pretty printing of console and write methods
				Added utils.siteManager.javaVersion
	7/20/2015	Added utils.getSectionInfo.getChildren(section, isHiddenInNAV)  
	8/13/2015	Added utils.getSectionInfo.getLevel(section)
				Added utils.toString(obj) 
	9/18/2015	Added utils.elementInfo.getElementID (element) Returns the id of an element.
				Added utils.media namspace to give some help with images utils.media.getMediaObject(int id)
						utils.media.getImageDimensions(mediaobj media)
						utils.media.getImageVariantsIds(string mediaElement).	
	11/2/2015	Added utils.getSectionInfo.getPathUntilLevel(finalLevel, currentSection)
				Added utils.getSectionInfo.getPathBySteps(stepsUp, currentSection)
				Modded utils.getSectionInfo.getRootPath to use getPathUntilLevel(0);
	1/6/2016	Modded the elementInfo namespace. This includes some bug checks.
	2/16/2016 	Added utils.Media.getImageTag.
	2/25/2016 	Removed utils.Media.getImageTag. There is an issue with utils classes and t4 tags 
				Merged in security namespace
				Merged in security.toSHA256(plainText)
	4/5/2016	Changed to a modular format. Using NPM + Gulp to script the builds. Changed to semantic versioning.
				Added another attempt at media.GetImageTag. It's incomplete ATM.
	4/14/2016	Moved the java depedencies to a seperate file. This is done to prevent future duplicates.
	Usage:
	1) Add a content type, modify the content layout, paste this at the top of your layout. 
	2) Your code will go below the T4Utils Object
	
	Examples:
	T4Utils.write("Some text"); 
	var sectionTitle = T4Utils.getSectionInfo.sectionTitle(section);
	var pathToRootArray = T4Utils.getSectionInfo.getRootPath(section);
	
	
	How to get url and text from a section link type. You can output 'normal' to get the whole link as well.
	var internalLink = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linkurl" ...  />');	
  	var internalLinkText = T4Utils.brokerUtils.processT4Tag('<t4 ... output="linktext" ... />');
	
	How do you get an image from the media library? Note the formatter. I had to change this from image/* to path/*.
	 var elv = T4Utils.elementInfo.getElementValue('Source'); //Returns a t4tag 
	  elv = elv.replace("image/*", "path/*"); //The t4 tag has the formatter = image versus just the source. So change it.
	  var sauce = T4Utils.brokerUtils.processT4Tag(elv);  //Process the t4 tag. Similar to below.
	OR
	var sauce = T4Utils.brokerUtils.processT4Tag('<t4 type="media" id="156737" formatter="path/*"/>');
*/



/* Notes:
	There are several varibles you can use:
		
	document: The output stream writer. This is critical if the script wants to write output to the appropriate location during publish. For example, during publish the output writer would either be writing directly to a publish file on disk, or writing to a String which in turn, would be written to a file on disk.
	
	publishCache: The name of the PublishCache object. publishCache.channel - returns the current channel?
	
	dbStatement: The name of the database Statement object used to talk to the database.
	
	section: The name of the Section object. The section in question is the one being currently published.
	
	content: The name of the Content object which is being published.
	
	contentList: The name of the array of CachedContent objects which are required when a page layout is being processed. This is likely to be null in the case of content layouts.
	
	template: The name of the Template object which is required content layouts, where it represents the content-type/template of which the content is an instance of. This is likely to be null in the case of page layouts.
	
	templateFormat: The name of the TemplateFormat object which represents the content layout for the given content instance. This is likely to be null in the case of content layouts.
	
	language: The language version of the given publish or preview.
	
	isPreview: A flag indicating whether the processing is occurring under a preview or a publish.
	
	isStyleHeader: A flag indicating whether the data being processed in a page layout is header or footer text. Not applicable in the case of content layouts.	
*/

'use strict';
/*jshint -W097*/
/** Class representing T4Utils */
var T4Utils = (function (utils) { 

	/**
	* Outputs the version of this utility
	* @return {string} The version of the T4Utility Class 
	*/
	utils.version = 'v1.0.2_2016.14.04';
	
	
	/**
	* Writes a message to the browser console 
	* @param {string} consoleMethod - You can specify which console method you want to use. "log, warn, error" are valid. 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console = function(consoleMethod, textOrObj) {		
		if(typeof textOrObj === "string") 
		{			
			document.write("<script>console." + consoleMethod + "('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a message to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.log = function(textOrObj) {		
		if(typeof textOrObj === "string")	
		{			
			document.write("<script>console.log('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a warning to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.warn = function(textOrObj) {		
		if(typeof textOrObj === "string")
		{
			document.write("<script>console.warn('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes an error to the browser console 
	* @param {string} textOrObj - The text you want to write to the screen. With the console method you should be able to write objects as well, but it's not the case from inside the Util class.	
	*/
	utils.console.error = function(textOrObj) {		
		if(typeof textOrObj === "string")
		{
			document.write("<script>console.error('" + textOrObj + "');</script>\n");				
		}
	};
	
	/**
	* Writes a paragraph formatted HTML message to the browser 
	* @param {string} text - The text you want to write to the screen.
	*/
    utils.write = function(text)
    {
      document.write("<p>" + text + "</p>\n");
    };
    
	/**
	* Converts a javascript object to Java string
	* @param {object} obj - The object you want to convert
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	*/
	utils.toString = function(obj)
	{
		return new java.lang.String(obj); 
	};
	
	/**
	* Converts a javascript object to Java string by prototying
	* @return {java.lang.String} The converted object.	
	* It has happend to me when using utils.elementInfo.getElementValue('') it'll return a java obj? the javascript toString method will not convert that to a javascript string. This will convert to a * string. grumble.
	* jshint -w121 extending the native javascript String object.
	*/
	/*jshint -W121*/
	String.prototype.toJavaString = function () {
		return new java.lang.String(this); //this is crazy.		
	};
	
	utils.escapeHtml = function (unsafe) {
		return unsafe.replace(/&/g, "&amp;")
    			.replace(/</g, "&lt;")
    			.replace(/>/g, "&gt;")
    			.replace(/'/g, "&#039;");
    			//.replace(/"/g, "&quot;");	
	};
	return utils;
})(T4Utils || {});
/**
 * T4Utils.sitemanager - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */

/** 
	Sitemanager namespace gets information about the sitemanager, duh.	
*/
T4Utils.siteManager = T4Utils.siteManager || {};

/**
*	Returns the version of the site manager
*	@return {string} The site manager version	
*/
T4Utils.siteManager.version = com.terminalfour.sitemanager.SiteManagerVersion.version;

/**
*	Returns the build details of the site manager
*	@return {string} The site manager build details	
*/	
T4Utils.siteManager.buildDetails = com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;

/**
*	Returns the java version of the site manager
*	@return {string} The site manager java version. Note: Anything below java 8 is obsolete. 4/4/16
*/	
T4Utils.siteManager.javaVersion = java.lang.System.getProperty("java.version");

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
*	Processes a t4 tag.
*	@param {string} t4Tag - HTML style T4 tag that needs to be processed. Typically something from the media library.
*	@return {string} A string value of the t4 tag output. Depends on the formatters you put in. 
*/
T4Utils.brokerUtils.processT4Tag = function (t4Tag) {
	var myContent = content || null; 
	return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag); 
};
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
*/	
T4Utils.elementInfo.getElements = function() {
	var c = content || null;
	if(c !== null) {
		c.getElements();	
	}
	else {
		return null;
	}
};

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
 /**
 * T4Utils.getSectionInfo - getSectionInfo namespace gets information about a section. duh.
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 *
 * v1.0.2 Moved dependencies
 *
 */
 
/* jshint strict: false */

/**
* Security namespace declaration
*/
T4Utils.getSectionInfo = T4Utils.getSectionInfo || {};

/** 
	Gets the publish link from a local variable. You have to setPublishLink first
	@return will return the publishing Link
*/
T4Utils.getSectionInfo.getPublishLink = function () {
	return this.publishLink;
};

/**
*	Get a link to this section
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {null} - stores the publishLink in the T4Utils.publishLink object. Use getPublishLink getter to get that object. Returns the PublishLink type in T4
*/
T4Utils.getSectionInfo.setPublishLink = function (section) {
	this.publishLink = PathBuilder.getLink(dbStatement, section, publishCache, language, isPreview); //cache the call         
};


/**
*	Gets the section title for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - The name of the section
*/
T4Utils.getSectionInfo.sectionTitle = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getText();
};

/**
*	Gets the section link for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - The link of the section
*/
T4Utils.getSectionInfo.sectionLink = function (section) {
	this.setPublishLink(section);
	return this.publishLink.getLink();
};

/**
*	Gets the section link for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - Returns a fully formed HTML anchor link for the section passed in
*/
T4Utils.getSectionInfo.anchorLink = function (section) {
	this.setPublishLink(section);
	var theLink = this.publishLink.getLink();
	var theText = this.publishLink.getText();
	var myLink = '<a href="' + theLink + '">' + theText + '</a>';
	return myLink;
};


/**
*	Gets the directory for the section passed in
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {string} - Get the directory on the filesystem that this section will be published to
*/
T4Utils.getSectionInfo.getDirectory = function(section) {
	return PathBuilder.getDirectory(section, publishCache, language).toString();		
};

/** 
*	This is an adaptation of the CachedSection.GetChildren method in the API. 		
*	There is an issue where section.getChildren() does not output the sections in order they are listed in the siteManager.
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {boolean} isHiddenInNAV - if is isHiddenInNAV is true then it will NOT output hidden sections.
*	@return {Content[]} Outputs an array of chilen in the expected order listed in the site manager.	
*/
T4Utils.getSectionInfo.getChildren = function(section, isHiddenInNAV) {
	if (isHiddenInNAV === undefined) {
		isHiddenInNAV = false;
	}
	return section.getChildren(publishCache.channel, language, isHiddenInNAV);
};


/**
*	Gets the path to root from currentSection
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@returns {Section[]} Returns an array of sections until root. Including the current section.    
*/
T4Utils.getSectionInfo.getRootPath = function (currentSection) {             
	return this.getPathUntilLevel(0, currentSection);
};   

/**
*	@usage
*	T4Utils.getSectionInfo.getPathUntilLevel(0, section); //go until level 0, otherwise known as root. 
*	T4Utils.getSectionInfo.getPathUntilLevel(2, section); //go until two levels up. 
*	@param {int} finalLevel - How far down do you want to traverse
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 
*/
T4Utils.getSectionInfo.getPathUntilLevel = function(finalLevel, currentSection, path)
{
	path = path || []; //initialize an array		
	path.push(currentSection);	
	var currentLevel = currentSection.getLevel(publishCache.channel);		
	if(finalLevel < currentLevel)
	{				
		var parentSection = currentSection.getParent();  //get the next node.
		return this.getPathUntilLevel(finalLevel, parentSection, path); //recurse up one level. 
	}
	else { return path; }
};

/**
*	Gets a path from the current section until we are N steps up from root
*	@usage
*	T4Utils.getSectionInfo.getPathBySteps(1, section); //go 1 step back otherwise get the parent
*	@param {int} stepsUp - How far up do you want to traverse
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
* 	@param {array} path - Used for recursively finding the path to finalLevel
*	@return {String[]} - Gets a path from the current section until we get to a certain level. 	
*/
T4Utils.getSectionInfo.getPathBySteps = function(stepsUp, currentSection, path)
{
	path = path || []; //initialize an array
	path.push(currentSection);
	if(path.length < stepsUp) 
	{
		var parentSection = currentSection.getParent();  //get the next node.
		if( parentSection === null ) { return path; } // break the recursion if we are at root.
		else { return this.getPathBySteps(stepsUp, parentSection, path); }//recurse up one level. 
	}
	else { return path; }
};

/**
*	Get the level of which the section is at. 
*	@param {Cachedsection} section - There is a predefined 'section; object you can pass here.
*	@return {int} - Returns an int of the level of which the section is at.     
*/
T4Utils.getSectionInfo.getLevel = function (section) {
	return section.getLevel(publishCache.channel);
};
/**
 * T4Utils.media - Gets objects from the media library.
 * @version v1.0.2
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 14, 2016
 * Copyright 2016. MIT licensed
 *
 * 4/14/16 v1.0.2 moved dependancies to javadependencies.js
 */
/* jshint strict: false */

/**
* Media namespace declaration
*/
T4Utils.media = T4Utils.media || {};

/**
*	Gets an array of image variantids. 
*	@param {Media} - Media Element from the site manager.
*	@return {array[int]} Returns an array of media ids.		
*/
T4Utils.media.getImageVariantsIds = function(mediaElement) {
	var imageID = content.get(mediaElement).getID();
	var variantIds = MediaManager.getManager().getMediaVariants(dbStatement.getConnection(), imageID, language);  	
	return variantIds;
};

/**
*	Gets the dimensions of a media object, obviously you should pass in a picture.
*	@param {object}  T4Utils.getMediaObect
*	@return {object} Returns an object that has two properties. width and height. 
*/
T4Utils.media.getImageDimensions = function(mediaObj) { 
	var d = { width: 0, height: 0 };
	d.width = MediaUtils.getImageDimensions(mediaObj)[0];
	d.height = MediaUtils.getImageDimensions(mediaObj)[1];
	return d;
};

/**
*	Get a media object from it's id. Note this is not the same as the media element
*	@param {int} The id of the media object you are trying to return.
*	@return {object} Returns a media object
*/
T4Utils.media.getMediaObject = function(mediaID) {		
	return MediaManager.getManager().get(dbStatement.getConnection(), mediaID, language);  
};

T4Utils.media.getImageTag = function(imageSource, altText, cssClass, sizesQuery)
{
	var imagesrc = '';
	
	try
	{
		var t4src = "<t4 />";
		T4Utils.write("Processing t4Tag: " + t4src);
		T4Utils.write("t4src is type: " + typeof t4src);
		T4Utils.write("t4src.length: " + t4src.length);
		T4Utils.write('t4 version: ' + T4Utils.siteManager.version);
		T4Utils.write('t4 buildDetails: ' + T4Utils.siteManager.buildDetails);
		T4Utils.write('t4 javaVersion: ' + T4Utils.siteManager.javaVersion);
	}
	catch(err)
	{
		document.write("error processing utils.media.getImageTag()");
		document.write(err.message);
	}
	return imagesrc;
};
/**
 * T4Utils.security - Security namespace for T4
 * @version v1.0.0
 * @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
 * @author Ben Margevicius
 * @date April 4, 2016
 * Copyright 2016. MIT licensed.
 */


/* jshint strict: false*/
/**
* Security namespace declaration
*/
T4Utils.security = T4Utils.security || {};
	
/**
*	Hashes a plaintext string into a SHA-256 Hex Encoded String
*	@param {string} plainText - Plain text value of the 
*	@return {string} A string value of the hash
*/	
T4Utils.security.toSHA256 = function(plainText) {	
	/* jshint bitwise: false */
	importPackage(java.security);

	var hash;
	try
	{	
		var md = MessageDigest.getInstance("SHA-256"); //Every implementation is required to have MD5, SHA-1, SHA-256. Don't use MD5 or SHA-1 anymore. 
		var pwBytes = new java.lang.String(plainText).getBytes("UTF-8");    
		md.update(pwBytes);
		var hashedBytes = md.digest();
		var sb = new java.lang.StringBuffer();
		for (var i = 0; i < hashedBytes.length; i++) {
			sb.append(java.lang.Integer.toString((hashedBytes[i] & 0xff) + 0x100, 16).substring(1)); //borrowed from http://www.mkyong.com/java/java-sha-hashing-example/
		}
		hash = sb.toString();
	}
	catch(e)
	{        
		document.write(e);
	}
	return hash;
};
/**
* T4Utils.ordinalIndicators
* @version v1.0.0
* @link git+https://github.com/virginiacommonwealthuniversity/T4Utils.git
* @author Joel Eisner
* @date April 15, 2016
* Copyright 2016. MIT licensed.
*/
/* jshint strict: false */

/**
* Ordinal indicators namespace declaration
*/
T4Utils.ordinalIndicators = T4Utils.ordinalIndicators || {};

/**
* Find if the position of the content within the page is the first of its kind
* @return {bool} true if first, false if not
*/
T4Utils.ordinalIndicators.pageFirst = (function() {
    var pageFirst = false;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pFirst = pieces[0];
            // If this piece of content is the first of its kind on the page...
            if (pFirst === this_uID) {
                pageFirst = true;
            } else {
                pageFirst = false;
            }
        }
    }
    return pageFirst;
})();

/**
* Find if the position of the content within the page is the last of its kind
* @return {bool} true if last, false if not
*/
T4Utils.ordinalIndicators.pageLast = (function() {
    var pageLast = false;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pLength = pieces.length,
            pIndex = pLength - 1,
            pLast = pieces[pIndex];
            // If this piece of content is the last of its kind on the page...
            if (pLast === this_uID) {
                pageLast = true;
            } else {
                pageLast = false;
            }
        }
    }
    return pageLast;
})();

/**
* Find index of the content within the page
* @return {int} the content's index number (starting from 0)
*/
T4Utils.ordinalIndicators.pageIndex = (function() {
    var contentIndex;
    // Create function to delete excess array objects if they have identical keys...
    function unique(arr) {
        var comparer = function compareObject(a, b) {
            if (a.key === b.key) {
                return 0;
            } else {
                if (a.key < b.key) {
                    return -1;
                } else {
                    return 1;
                }
            }
        };
        arr.sort(comparer);
        var end;
        for (var i = 0; i < arr.length - 1; ++i) {
            if (comparer(arr[i], arr[i+1]) === 0) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    // Grab all pieces of content on the page
    var cL = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent (com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent (section.getContent (publishCache.getChannel (), com.terminalfour.sitemanager.cache.CachedContent.APPROVED)));
    // Run through each piece of content, find out all the content types, and create a key array...
    var listContentTypeIDs = [];
    for (var j = 0; j < cL.length; j++) {
        var contentPiece = cL[j],
            pieceID = contentPiece.getTemplateID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getTemplateID(),
            uID = cP.getID();
        for (var l = 0; l < listContentTypeIDs.length; l++) {
            var contentTypeID = listContentTypeIDs[l];
            if (ctID === contentTypeID.key) {
                var p = contentTypeID.pieces;
                p.push(uID);
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    for (var m = 0; m < listContentTypeIDs.length; m++) {
        var typeID = listContentTypeIDs[m];
        // Find the current content piece in the array of all alike content on the page...
        if (typeID.key === this_ctID) {
            var pieces = typeID.pieces,
            pLength = pieces.length;
            // Set the contentIndex variable...
            for (var n = 0; n < pLength; n++) {
                var piece = pieces[n];
                if (this_uID === piece) {
                    contentIndex = n;
                    break;
                }
            }
        }
    }
    return contentIndex;
})();

/**
* Find if the position of the content within a groupset is the first of its kind
* @return {bool} true if first, false if not
*/
T4Utils.ordinalIndicators.groupFirst = (function() {
    var tid = content.getTemplateID(),
        sid = section.getID(),
        oCH = new ContentHierarchy(),
        oCM = ContentManager.getManager(),
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupFirst = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(dbStatement,contentInSection[i],"en").getID()) {
            if (i === 0) {
                groupFirst = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i-1],"en").getTemplateID()) {
                groupFirst = true;
            } else {
                groupFirst = false;
            }
        }
    }
    return groupFirst;
})();

/**
* Find if the position of the content within a groupset is the last of its kind
* @return {bool} true if last, false if not
*/
T4Utils.ordinalIndicators.groupLast = (function() {
    var tid = content.getTemplateID(),
        sid = section.getID(),
        oCH = new ContentHierarchy(),
        oCM = ContentManager.getManager(),
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupLast = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(dbStatement,contentInSection[i],"en").getID()) {
            if (i === contentInSection.length-1) {
                groupLast = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i+1],"en").getTemplateID()) {
                groupLast = true;
            } else {
                groupLast = false;
            }
        }
    }
    return groupLast;
})();
