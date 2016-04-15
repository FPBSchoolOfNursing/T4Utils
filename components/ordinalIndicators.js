/**
* T4Utils.ordinalIndicators
* @version v0.0.1
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
* Find the position of the content in context of the page
* @return {hash} A hash with three key/value pairs: first, last, index
* @return[0] {bool} Returns true/false in relation to if the content is the first of its kind on the page
* @return[1] {bool} Returns true/false in relation to if the content is the last of its kind on the page
* @return[2] {int} Returns a number, starting from zero, indicating the position of the content type on the page in relation to all other instances of that content type
*/
T4Utils.ordinalIndicators.page = function() {
    // Define the initial states of all returned values
    var pageFirst = false,
        pageLast = false,
        contentIndex, hash;
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
    var c;
    for (c in cL) {
        if (cL.hasOwnProperty(c)) {
            var ctIDo = c.getTemplateID();
            listContentTypeIDs.push({
                'key': ctIDo,
                'pieces': []
            });
        }
    }
    unique(listContentTypeIDs);
    // Run through each piece of content, and put them in their corresponding key object
    var n;
    for (n in cL) {
        if (cL.hasOwnProperty(n)) {
            var ctIDt = n.getTemplateID(),
                uID = n.getID(),
                k;
            for (k in listContentTypeIDs) {
                if (ctIDt === k.key) {
                    var p = k.pieces;
                    p.push(uID);
                }
            }
        }
    }
    // Get the current content type ID and unique ID
    var this_ctID = content.getTemplateID(),
        this_uID = content.getID();
    // Set the pageFirst and pageLast values
    var z;
    for (z in listContentTypeIDs) {
        // Find the current content piece in the array of all alike content on the page...
        if (z.key === this_ctID) {
            var pieces = z.pieces,
                pFirst = pieces[0],
                pLength = pieces.length,
                pIndex = pLength - 1,
                pLast = pieces[pIndex];
            // Set the contentIndex variable...
            for (var i = 0; i < pLength; i++) {
                var piece = pieces[i];
                if (this_uID === piece) {
                    contentIndex = i;
                    break;
                }
            }
            // If this piece of content is the first of its kind on the page...
            if (pFirst === this_uID) {
                pageFirst = true;
            } else {
                pageFirst = false;
            }
            // If this piece of content is the last of its kind on the page...
            if (pLast === this_uID) {
                pageLast = true;
            } else {
                pageLast = false;
            }
        }
    }
    hash = {
        first: pageFirst,
        last: pageLast,
        index: contentIndex
    };
    return hash;
};

/**
* Find the position of the content in context within a groupset
* @return {hash} A hash with two key/value pairs: first, last
* @return[0] {bool} Returns true/false in relation to if the content is the first of its kind in a groupset
* @return[1] {bool} Returns true/false in relation to if the content is the last of its kind in a groupset
*/
T4Utils.ordinalIndicators.group = function() {
    var tid = content.getTemplateID(),
        sid = section.getID(),
        oCH = new ContentHierarchy(),
        oCM = ContentManager.getManager(),
        contentInSection = oCH.getContent(dbStatement,sid,'en'),
        groupFirst, groupLast, hash;
    for (var i = 0; i < contentInSection.length; i++) {
        if (content.getID() === oCM.get(dbStatement,contentInSection[i],"en").getID()) {
            if (i === 0) {
                groupFirst = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i-1],"en").getTemplateID()) {
                groupFirst = true;
            } else {
                groupFirst = false;
            }
            if (i === contentInSection.length-1) {
                groupLast = true;
            } else if (tid !==  oCM.get(dbStatement,contentInSection[i+1],"en").getTemplateID()) {
                groupLast = true;
            } else {
                groupLast = false;
            }
        }
    }
    hash = {
        first: groupFirst,
        last: groupLast
    };
    return hash;
};
