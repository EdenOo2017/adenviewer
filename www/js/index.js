var viewer;
var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
}

var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE3LTEwLTE5LTEzLTUyLTMxLWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL0JpbUZvckxvZ2lzdGljLnJ2dA';

Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
});

function onDocumentLoadSuccess(doc) {

    // A document contains references to 3D and 2D viewables.
    var viewable = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type': 'geometry',
        'role': '3d'
    }, true);
    if (viewable.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    var initialViewable = viewable[0];
    var svfUrl = doc.getViewablePath(initialViewable);
    var modelOptions = { sharedPropertyDbPath: doc.getPropertyDbPath() };
    var viewerDiv = document.getElementById('viewerDiv');
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onLoadModelSuccess(model) {
    console.log('onLoadModelSuccess()!');
    console.log('Validate model loaded: ' + (viewer.model === model));
    console.log(model);
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
}

function onLoadModelError(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
}

var orange = new THREE.Vector4(0.996078, 0.439216, 0.101961, 0.5);
var green = new THREE.Vector4(0.239, 0.674, 0.0078, 0.5);
var pupple = new THREE.Vector4(0.996078, 0.086275, 0.784314, 0.5);
var blue = new THREE.Vector4(0.207843, 0.207843, 0.890196, 0.5);
var brown = new THREE.Vector4(1, 0, 0.298039, 0.5);


function changeColor(reqUrl, colour , extsion) {

    $.ajax({
        async: true,
        crossDomain: true,
        url: reqUrl,
        method: "GET",
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var idList = response[i];
            for (var n = 0; n < idList.length; n++) {
                var RevitElementID = idList[n]
                viewer.search(RevitElementID.toString(), function (dbIds) {
                    extsion.setColor(dbIds, colour)
                })
            }
        }
    });
}

function onGeometryLoaded(event) {
    var viewer = event.target;
    var promise = viewer.loadExtension('MyExternal.Extension.Id')
    promise.then(function (externalExtension) {

        changeColor("https://polar-mesa-97572.herokuapp.com/get-Status1", orange , externalExtension)
        changeColor("https://polar-mesa-97572.herokuapp.com/get-Status2", green , externalExtension)
        changeColor("https://polar-mesa-97572.herokuapp.com/get-Status3", pupple , externalExtension)
        changeColor("https://polar-mesa-97572.herokuapp.com/get-Status4", blue , externalExtension)
        changeColor("https://polar-mesa-97572.herokuapp.com/get-Status5", brown , externalExtension)

    });

    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
}


