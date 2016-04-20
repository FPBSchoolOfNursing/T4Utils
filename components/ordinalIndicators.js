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
            pieceID = contentPiece.getContentTypeID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getContentTypeID(),
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
    var this_ctID = content.getContentTypeID(),
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
        //var end;
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
            pieceID = contentPiece.getContentTypeID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getContentTypeID(),
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
    var this_ctID = content.getContentTypeID(),
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
        //var end;
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
            pieceID = contentPiece.getContentTypeID();
        listContentTypeIDs.push({
            'key': pieceID,
            'pieces': []
        });
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    for (var k = 0; k < cL.length; k++) {
        var cP = cL[k],
            ctID = cP.getContentTypeID(),
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
    var this_ctID = content.getContentTypeID(),
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
    var tid = content.getContentTypeID(),
        sid = section.getID(),
        oCH = new ContentHierarchy(),
        oCM = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.content.IContentManager),
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupFirst = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(contentInSection[i],"en").getID()) {
            if (i === 0) {
                groupFirst = true;
            } else if (tid !==  oCM.get(contentInSection[i-1],"en").getContentTypeID()) {
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
    var tid = content.getContentTypeID(),
        sid = section.getID(),
        oCH = new ContentHierarchy(),
        oCM = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.content.IContentManager),
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupLast = false;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(contentInSection[i],"en").getID()) {
            if (i === contentInSection.length-1) {
                groupLast = true;
            } else if (tid !==  oCM.get(contentInSection[i+1],"en").getContentTypeID()) {
                groupLast = true;
            } else {
                groupLast = false;
            }
        }
    }
    return groupLast;
})();
