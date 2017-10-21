// /////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.Color
//
// /////////////////////////////////////////////////////////////////////////////

AutodeskNamespace('Autodesk.ADN.Viewing.Extension')
Autodesk.ADN.Viewing.Extension.Color = function (viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options)

  var overlayName = 'temperary-colored-overlay'
  var _self = this
  var currentNodeIds

  _self.load = function () {
    console.log('Autodesk.ADN.Viewing.Extension.Color loaded')

    // /////////////////////////////////////////////////////////////////////////
    // add new material    
    // /////////////////////////////////////////////////////////////////////////

    function addMaterial(color) {

      var material = new THREE.MeshPhongMaterial({

        color: color,
        opacity: 0,
        transparent: false

      })
      // viewer.impl.matman().addMaterial(newGuid(), material)
      viewer.impl.createOverlayScene(overlayName, material, material)
      return material
    }

    // /////////////////////////////////////////////////////////////////////////
    // Set color for nodes
    // objectIds should be an array of dbId
    // /////////////////////////////////////////////////////////////////////////

    Autodesk.Viewing.Viewer3D.prototype.setColor = function (objectIds, color) {
      var material = addMaterial(color)

      for (var i = 0; i < objectIds.length; i++) {
        var dbid = objectIds[i]

        viewer.model.setThemingColor(dbid, color);

        //from dbid to node, to fragid
        var it = viewer.model.getData().instanceTree

        it.enumNodeFragments(dbid, function (fragId) {

          var renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId)

          renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, renderProxy.material)

          renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld)
          renderProxy.meshProxy.matrixWorldNeedsUpdate = true
          renderProxy.meshProxy.matrixAutoUpdate = false
          renderProxy.meshProxy.frustumCulled = false

          viewer.impl.addOverlay(overlayName, renderProxy.meshProxy)
          viewer.impl.invalidate(true)

        }, false)

        // console.log('setColor')
        // console.log(`${dbid}`)
      }
      viewer.impl.invalidate(true, true, true)
    }
  }
  _self.onSelectionChanged = function (event) {
    currentNodeIds = event.dbIdArray
  }

  _self.unload = function () {
    console.log('Autodesk.ADN.Viewing.Extension.Color unloaded')
    return true
  }
}
Autodesk.ADN.Viewing.Extension.Color.prototype = Object.create(Autodesk.Viewing.Extension.prototype)
Autodesk.ADN.Viewing.Extension.Color.prototype.constructor = Autodesk.ADN.Viewing.Extension.Color
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.ADN.Viewing.Extension.Color', Autodesk.ADN.Viewing.Extension.Color)
