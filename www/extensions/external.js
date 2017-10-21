(function () {

  'use strict';

  function MyExternalExtension(viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options)
  }

  MyExternalExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype)
  MyExternalExtension.prototype.constructor = MyExternalExtension

  var proto = MyExternalExtension.prototype
  var overlayName = 'temperary-colored-overlay'
  var currentNodeIds

  proto.load = function () {

    console.log('External Extension loaded!')

    return true
  }

  proto.unload = function () {

    console.log('External Extension unloaded!')

    return true
  }

  proto.setColor = function (dbid, color) {
    viewer.model.setThemingColor(dbid, color);
    viewer.impl.invalidate(true, true, true)
    return true
  }

  Autodesk.Viewing.theExtensionManager.registerExtension('MyExternal.Extension.Id', MyExternalExtension)
  Autodesk.Viewing.theExtensionManager.registerExternalExtension('MyExternal.Extension.Id', 'http://localhost:3000/www/extensions/external.js')
})()