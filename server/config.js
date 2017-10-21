'use strict'; 

module.exports = {
  
  callbackURL: process.env.FORGE_CALLBACK_URL || 'http://localhost:3000/api/forge/callback/oauth',

  credentials: {
    client_id: process.env.FORGE_CLIENT_ID || '6k4FLeNnhuAg8rsG2YUW6ssyXqFCtTFR',
    client_secret: process.env.FORGE_CLIENT_SECRET || 'V3c6ab33a5513434'
  },

  scopeInternal: ['data:read','data:write','data:create','data:search'],  
  scopePublic: ['viewables:read']
};