define({
  "api": [{
      "type": "post",
      "url": "/account/",
      "title": "create a new account",
      "name": "create",
      "group": "Account",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "firstName",
              "description": "<p>First name of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "lastName",
              "description": "<p>Last name of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "pronoun",
              "description": "<p>the pronoun of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>Email of the account.</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": false,
              "field": "dietaryRestrictions",
              "description": "<p>Any dietary restrictions for the user. 'None' if there are no restrictions</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "shirtSize",
              "description": "<p>Size of the shirt that the user will receive.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "password",
              "description": "<p>The password of the account.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "birthDate",
              "description": "<p>a Date parsable string.</p>"
            },
            {
              "group": "body",
              "type": "Number",
              "optional": false,
              "field": "phoneNumber",
              "description": "<p>the user's phone number, represented as a string.</p>"
            }
          ],
          "header": [{
            "group": "header",
            "type": "JWT",
            "optional": true,
            "field": "token",
            "description": "<p>the user's invite token.</p>"
          }]
        },
        "examples": [{
          "title": "Request-Example:",
          "content": "{ \n               \"firstName\": \"Theo\",\n               \"lastName\":\"Klein\",\n               \"pronoun\":\"he/him\",\n               \"email\":\"theo@klein.com\",\n               \"password\":\"hunter2\",\n               \"dietaryRestrictions\":[\"Halal\"],\n               \"phoneNumber\":1234567890,\n               \"shirtSize\":\"S\",\n               \"birthDate\":\"10/30/1997\"\n}",
          "type": "json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Account object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Account creation successful\", \n               \"data\": {\n                       \"id\": ObjectId(\"5bff8b9f3274cf001bc71048\"),\n                   \t\"firstName\": \"Theo\",\n                       \"lastName\":\"Klein\",\n                       \"pronoun\":\"he/him\",\n                       \"email\":\"theo@klein.com\",\n                       \"dietaryRestrictions\":[\"Halal\"],\n                       \"phoneNumber\":1234567890,\n                   \t\"shirtSize\":\"S\",\n                       \"birthDate\":Date(\"10/30/1997\")\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\n   \"message\": \"Account already exists\", \n    \"data\": {\n        \"route\": \"/\"\n    }\n}",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/"
      }]
    },
    {
      "type": "get",
      "url": "/account/:id",
      "title": "gets information from an account with mongoid ':id'",
      "name": "getAccount",
      "group": "Account",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>MongoId of an account</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Account object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Account found by user id\", \n               \"data\": {\n                   \"id\": ObjectId(\"5bff8b9f3274cf001bc71048\"),\n                   \"firstName\": \"Theo\",\n                   \"lastName\":\"Klein\",\n                   \"pronoun\":\"he/him\",\n                   \"email\":\"theo@klein.com\",\n                   \"dietaryRestrictions\":[\"Halal\"],\n                   \"phoneNumber\":1234567890,\n                   \"shirtSize\":\"S\",\n                   \"birthDate\":Date(\"10/30/1997\")\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Account not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/:id"
      }]
    },
    {
      "type": "get",
      "url": "/account/invite",
      "title": "Get all of the invites.",
      "name": "getAllInvites",
      "group": "Account",
      "version": "0.0.8",
      "description": "<p>Get all of the invites that currently exist in the database.</p>",
      "success": {
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Invite retrieval successful.\", \n               \"data\": [{\n                   \"email\":\"abc@def.com\",\n                   \"accountType\":\"Hacker\"\n               }]\n           }",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/invite"
      }]
    },
    {
      "type": "post",
      "url": "/account/invite",
      "title": "invites a user to create an account with the specified accountType",
      "name": "inviteAccount",
      "group": "Account",
      "version": "0.0.8",
      "description": "<p>sends link with token to be used with the account/create route</p>",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "email",
              "description": "<p>email of the account to be created and where to send the link</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "accountType",
              "description": "<p>the type of the account which the user can create, for sponsor this should specify tier as well</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Account object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully invited user\", \n               \"data\": {}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Error object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response:",
          "content": "{\n                \"message\": \"Invalid Authentication\",\n                \"data\": {\n                    \"route\": \"/invite\"\n                }\n            }",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/invite"
      }]
    },
    {
      "type": "get",
      "url": "/account/self",
      "title": "get information about own account",
      "name": "self",
      "group": "Account",
      "version": "0.0.8",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Account object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Account found by user email\", \n               \"data\": {\n                   \t\"id\": ObjectId(\"5bff8b9f3274cf001bc71048\"),\n                   \t\"firstName\": \"Theo\",\n                       \"lastName\":\"Klein\",\n                       \"pronoun\":\"he/him\",\n                       \"email\":\"theo@klein.com\",\n                       \"dietaryRestrictions\":[\"Halal\"],\n                       \"phoneNumber\":1234567890,\n                   \t\"shirtSize\":\"S\",\n                       \"birthDate\":Date(\"10/30/1997\")\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Account not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/self"
      }]
    },
    {
      "type": "patch",
      "url": "/account/:id",
      "title": "update an account's information",
      "name": "updateOneUser",
      "group": "Account",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "firstName",
              "description": "<p>First name of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "lastName",
              "description": "<p>Last name of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "pronoun",
              "description": "<p>the pronoun of the account creator.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "email",
              "description": "<p>Email of the account.</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": true,
              "field": "dietaryRestrictions",
              "description": "<p>Any dietary restrictions for the user. 'None' if there are no restrictions</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "shirtSize",
              "description": "<p>Size of the shirt that the user will receive.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "birthDate",
              "description": "<p>a Date parsable string.</p>"
            },
            {
              "group": "body",
              "type": "Number",
              "optional": true,
              "field": "phoneNumber",
              "description": "<p>the user's phone number, represented as a string.</p>"
            }
          ]
        },
        "examples": [{
          "title": "Request-Example:",
          "content": "{ \"shirtSize\": \"M\" }",
          "type": "json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Account object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Changed account information\", \n               \"data\": {\n                       \"id\": ObjectId(\"5bff8b9f3274cf001bc71048\"),\n                   \t\"firstName\": \"Theo\",\n                       \"lastName\":\"Klein\",\n                       \"pronoun\":\"he/him\",\n                       \"email\":\"theo@klein.com\",\n                       \"dietaryRestrictions\":[\"Halal\"],\n                       \"phoneNumber\":1234567890,\n                   \t\"shirtSize\":\"M\",\n                       \"birthDate\":Date(\"10/30/1997\")\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while updating account\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/account.js",
      "groupTitle": "Account",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/account/:id"
      }]
    },
    {
      "type": "patch",
      "url": "/auth/password/change",
      "title": "change password for logged in user",
      "name": "changePassword",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "Parameter": [{
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "oldPassword",
              "description": "<p>The current password of the user</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "newPassword",
              "description": "<p>The new password of the user</p>"
            }
          ]
        },
        "examples": [{
          "title": "Request-Example:",
          "content": "{ \n    \"oldPassword\": \"password12345\",\n    \"newPassword\": \"password123456\"\n}",
          "type": "json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully reset password\", \"data\": {}}",
          "type": "json"
        }]
      },
      "permission": [{
        "name": ": Must be logged in"
      }],
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/password/change"
      }]
    },
    {
      "type": "post",
      "url": "/auth/confirm/:token",
      "title": "confirm account using the JWT in :token",
      "name": "confirmAccount",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "Parameter": [{
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "JWT",
            "description": "<p>for confirming the account</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response:",
          "content": "{\"message\": \"Successfully confirmed account\", \"data\": {}}",
          "type": "json"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Invalid token for confirming account, \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/confirm/:token"
      }]
    },
    {
      "type": "post",
      "url": "/auth/password/forgot",
      "title": "forgot password route",
      "name": "forgotPassword",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "Parameter": [{
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the email address of the account</p>"
          }]
        },
        "examples": [{
          "title": "Request-Example:",
          "content": "{ \"email\": \"myemail@mchacks.ca\" }",
          "type": "json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\"message\": \"Sent reset email\", \"data\": {}}",
          "type": "json"
        }]
      },
      "permission": [{
        "name": ": public"
      }],
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/password/forgot"
      }]
    },
    {
      "type": "get",
      "url": "/auth/rolebindings/:id",
      "title": "retrieve rolebindings for a user given by their user id :id",
      "name": "getRoleBindings",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>MongoId of an account</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Rolebindings object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved role bindings\",\n               \"data\": {\n                   accountId:\"5beca4ab2e069a34f91697b2\"\n                   id:\"5beca4ae2e069a34f91698b1\"\n                   roles: [\n                       {\n                           _id:\"5beca4ab2e069a34f91697d9\",\n                           name:\"hacker\",\n                           routes: [\n                               {_id: \"5beca4ae2e069a34f9169852\", requestType: \"POST\", uri: \"/api/auth/login\"},\n                               {_id: \"5beca4ae2e069a34f9169851\", requestType: \"POST\", uri: \"/api/auth/logout\"},\n                               {_id: \"5beca4ae2e069a34f9169850\", requestType: \"GET\", uri: \"/api/auth/rolebindings/:self\"},\n                               {_id: \"5beca4ae2e069a34f916984f\", requestType: \"GET\", uri: \"/api/account/self\"},\n                               {_id: \"5beca4ae2e069a34f916984e\", requestType: \"GET\", uri: \"/api/account/:self\"},\n                               {_id: \"5beca4ae2e069a34f916984d\", requestType: \"PATCH\", uri: \"/api/account/:self\"},\n                               {_id: \"5beca4ae2e069a34f916984c\", requestType: \"POST\", uri: \"/api/hacker/\"},\n                               {_id: \"5beca4ae2e069a34f916984b\", requestType: \"GET\", uri: \"/api/hacker/:self\"},\n                               {_id: \"5beca4ae2e069a34f916984a\", requestType: \"GET\", uri: \"/api/hacker/:self/resume\"},\n                               {_id: \"5beca4ae2e069a34f9169849\", requestType: \"PATCH\", uri: \"/api/hacker/:self\"}\n                           ]\n                       }\n                   ]\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Role Bindings not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/rolebindings/:id"
      }]
    },
    {
      "type": "get",
      "url": "/auth/roles",
      "title": "get roles",
      "name": "getRoles",
      "description": "<p>get all roles that exist in the database</p>",
      "group": "Authentication",
      "version": "0.0.8",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response:",
          "content": "{\"message\": \"Sucessfully retrieved all roles\", \"data\":\n[{name: \"GodStaff\", routes: Array(27), id: \"5bee20ef3ca9dd4754382880\"},\n {name: \"Hacker\", routes: Array(10), id: \"5bee20ef3ca9dd4754382881\"},\n {name: \"Volunteer\", routes: Array(4), id: \"5bee20ef3ca9dd4754382882\"}]",
          "type": "json"
        }]
      },
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/roles"
      }]
    },
    {
      "type": "post",
      "url": "/auth/login",
      "title": "login to the service",
      "name": "login",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "Parameter": [{
              "group": "Parameter",
              "type": "string",
              "optional": false,
              "field": "email",
              "description": "<p>Account email</p>"
            },
            {
              "group": "Parameter",
              "type": "string",
              "optional": false,
              "field": "password",
              "description": "<p>Account password</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully logged in\", \"data\": {}}",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Invalid Authentication\", \"data\": {}}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": ": public"
      }],
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/login"
      }]
    },
    {
      "type": "get",
      "url": "/auth/logout",
      "title": "logout of service",
      "name": "logout",
      "group": "Authentication",
      "version": "0.0.8",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully logged out\", \"data\": {}}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": ": public"
      }],
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/logout"
      }]
    },
    {
      "type": "get",
      "url": "/auth/confirm/resend",
      "title": "resend confirmation token",
      "name": "resendConfirmAccount",
      "group": "Authentication",
      "version": "0.0.8",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response:",
          "content": "{\"message\": \"Successfully resent confirmation email\", \"data\": {}}",
          "type": "json"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
            "title": "Error-Response:",
            "content": " HTTP/1.1 422\n{\"message\": \"Account already confirmed\", \"data\": {}}",
            "type": "json"
          },
          {
            "title": "Error-Response:",
            "content": " HTTP/1.1 428\n{\"message\": \"Account confirmation token does not exist\", \"data\": {}}",
            "type": "json"
          }
        ]
      },
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/confirm/resend"
      }]
    },
    {
      "type": "post",
      "url": "/auth/password/reset",
      "title": "reset password",
      "name": "resetPassword",
      "group": "Authentication",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "Parameter": [{
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the password of the account</p>"
          }]
        },
        "examples": [{
          "title": "Request-Example:",
          "content": "{ \"password\": \"hunter2\" }",
          "type": "json"
        }]
      },
      "header": {
        "fields": {
          "Header": [{
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authentication",
            "description": "<p>the token that was provided in the reset password email</p>"
          }]
        },
        "examples": [{
          "title": "Header-Example:",
          "content": "{\n  \"X-Reset-Token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\"\n}",
          "type": "json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully reset password\", \"data\": {}}",
          "type": "json"
        }]
      },
      "permission": [{
        "name": ": must have authentication token"
      }],
      "filename": "routes/api/auth.js",
      "groupTitle": "Authentication",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/auth/password/reset"
      }]
    },
    {
      "type": "patch",
      "url": "/hacker/checkin/:id",
      "title": "update a hacker's status to be 'Checked-in'. Note that the Hacker must eitehr be Accepted or Confirmed.",
      "name": "checkinHacker",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "body": [{
            "group": "body",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>Check-in status. &quot;Checked-in&quot;</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Changed hacker information\", \n    \"data\": {\n        \"status\": \"Checked-in\"\n    }\n}",
          "type": "object"
        }]
      },
      "permission": [{
          "name": "Administrator"
        },
        {
          "name": "Volunteer"
        }
      ],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/checkin/:id"
      }]
    },
    {
      "type": "post",
      "url": "/hacker/",
      "title": "create a new hacker",
      "name": "createHacker",
      "group": "Hacker",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "MongoID",
              "optional": false,
              "field": "accountId",
              "description": "<p>ObjectID of the respective account</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "school",
              "description": "<p>Name of the school the hacker goes to</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "gender",
              "description": "<p>Gender of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Boolean",
              "optional": false,
              "field": "needsBus",
              "description": "<p>Whether the hacker requires a bus for transportation</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": false,
              "field": "ethnicity",
              "description": "<p>the ethnicities of the hacker</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": false,
              "field": "major",
              "description": "<p>the major of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Number",
              "optional": false,
              "field": "graduationYear",
              "description": "<p>the graduation year of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Boolean",
              "optional": false,
              "field": "codeOfConduct",
              "description": "<p>acceptance of the code of conduct</p>"
            },
            {
              "group": "body",
              "type": "Json",
              "optional": false,
              "field": "application",
              "description": "<p>The hacker's application. Resume and jobInterest fields are required.</p>"
            }
          ]
        },
        "examples": [{
          "title": "application: ",
          "content": "{\n               \"application\":{\n                   \"portfolioURL\":{\n                       \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                       \"github\":\"https://github.com/abcd\",\n                       \"dropler\":\"https://dribbble.com/abcd\",\n                       \"personal\":\"https://www.hi.com/\",\n                       \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                       \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                   },\n                   \"jobInterest\":\"Internship\",\n                   \"skills\":[\"Javascript\",\"Typescript\"],\n                   \"comments\":\"hi!\",\n                   \"essay\":\"Pls accept me\"\n}",
          "type": "Json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Hacker creation successful\", \n    \"data\": {\n                   \"id\":\"5bff4d736f86be0a41badb91\",\n                   \"application\":{\n                       \"portfolioURL\":{\n                           \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                           \"github\":\"https://github.com/abcd\",\n                           \"dropler\":\"https://dribbble.com/abcd\",\n                           \"personal\":\"https://www.hi.com/\",\n                           \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                           \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                       },\n                       \"jobInterest\":\"Internship\",\n                       \"skills\":[\"Javascript\",\"Typescript\"],\n                       \"comments\":\"hi!\",\n                       \"essay\":\"Pls accept me\"\n                   },\n                   \"status\":\"Applied\",\n                   \"ethnicity\":[\"White or Caucasian\",\" Asian or Pacific Islander\"],\n                   \"accountId\":\"5bff2a35e533b0f6562b4998\",\n                   \"school\":\"McPherson College\",\n                   \"gender\":\"Female\",\n                   \"needsBus\":false,\n                   \"major\":\"Accounting\",\n                   \"graduationYear\":2019,\n                   \"codeOfConduct\":true,\n    }\n}",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while creating hacker\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/"
      }]
    },
    {
      "type": "get",
      "url": "/hacker/email/:email",
      "title": "get a hacker's information",
      "name": "getHacker",
      "group": "Hacker",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>a hacker's unique email</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved hacker information\", \n               \"data\": {\n                   \"id\":\"5bff4d736f86be0a41badb91\",\n                   \"application\":{\n                       \"portfolioURL\":{\n                           \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                           \"github\":\"https://github.com/abcd\",\n                           \"dropler\":\"https://dribbble.com/abcd\",\n                           \"personal\":\"https://www.hi.com/\",\n                           \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                           \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                       },\n                       \"jobInterest\":\"Internship\",\n                       \"skills\":[\"Javascript\",\"Typescript\"],\n                       \"comments\":\"hi!\",\n                       \"essay\":\"Pls accept me\"\n                   },\n                   \"status\":\"Applied\",\n                   \"ethnicity\":[\"White or Caucasian\",\" Asian or Pacific Islander\"],\n                   \"accountId\":\"5bff2a35e533b0f6562b4998\",\n                   \"school\":\"McPherson College\",\n                   \"gender\":\"Female\",\n                   \"needsBus\":false,\n                   \"major\":\"Accounting\",\n                   \"graduationYear\":2019,\n                   \"codeOfConduct\":true,\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Hacker not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/email/:email"
      }]
    },
    {
      "type": "get",
      "url": "/hacker/:id",
      "title": "get a hacker's information",
      "name": "getHacker",
      "group": "Hacker",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>a hacker's unique mongoID</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved hacker information\", \n               \"data\": {\n                   \"id\":\"5bff4d736f86be0a41badb91\",\n                   \"application\":{\n                       \"portfolioURL\":{\n                           \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                           \"github\":\"https://github.com/abcd\",\n                           \"dropler\":\"https://dribbble.com/abcd\",\n                           \"personal\":\"https://www.hi.com/\",\n                           \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                           \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                       },\n                       \"jobInterest\":\"Internship\",\n                       \"skills\":[\"Javascript\",\"Typescript\"],\n                       \"comments\":\"hi!\",\n                       \"essay\":\"Pls accept me\"\n                   },\n                   \"status\":\"Applied\",\n                   \"ethnicity\":[\"White or Caucasian\",\" Asian or Pacific Islander\"],\n                   \"accountId\":\"5bff2a35e533b0f6562b4998\",\n                   \"school\":\"McPherson College\",\n                   \"gender\":\"Female\",\n                   \"needsBus\":false,\n                   \"major\":\"Accounting\",\n                   \"graduationYear\":2019,\n                   \"codeOfConduct\":true,\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Hacker not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/:id"
      }]
    },
    {
      "type": "get",
      "url": "/hacker/resume:id",
      "title": "get the resume for a hacker.",
      "name": "getHackerResume",
      "group": "Hacker",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>Hacker id</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }]
        },
        "examples": [{
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK \n{ \n    message: \"Downloaded resume\", \n    data: { \n        id: \"507f191e810c19729de860ea\", \n        resume: [Buffer] \n    } \n}",
          "type": "json"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Resume does not exist&quot;</p>"
          }]
        },
        "examples": [{
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 \n{ \n    message: \"Resume not found\", \n    data: {} \n}",
          "type": "json"
        }]
      },
      "permission": [{
        "name": "Must be logged in, and the account id must be linked to the hacker."
      }],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker"
    },
    {
      "type": "get",
      "url": "/hacker/stats",
      "title": "Gets the stats of all of the hackers who have applied.",
      "name": "getHackerStats",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "query": [{
              "group": "query",
              "type": "String",
              "optional": false,
              "field": "model",
              "description": "<p>the model to be searched (Only hacker supported)</p>"
            },
            {
              "group": "query",
              "type": "Array",
              "optional": false,
              "field": "q",
              "description": "<p>the query to be executed. For more information on how to format this, please see https://docs.mchacks.ca/architecture/</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Retrieved stats\",\n    \"data\": {\n        \"stats\" : {\n            \"total\": 10,\n                       \"status\": { \"Applied\": 10 },\n                       \"school\": { \"McGill University\": 3, \"Harvard University\": 7 },\n                       degree: { \"Undergraduate\": 10 },\n                       gender: { \"Male\": 1, \"Female\": 9 },\n                       needsBus: { \"true\": 7, \"false\": 3 },\n                       ethnicity: { \"White\": 10, },\n                       jobInterest: { \"Internship\": 10 },\n                       major: { \"Computer Science\": 10 },\n                       graduationYear: { \"2019\": 10 },\n                       dietaryRestrictions: { \"None\": 10 },\n                       shirtSize: { \"M\": 3, \"XL\": 7 },\n                       age: { \"22\": 10 }\n                   }\n    }\n}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/stats"
      }]
    },
    {
      "type": "patch",
      "url": "/hacker/:id",
      "title": "update a hacker's information.",
      "description": "<p>This route only contains the ability to update a subset of a hacker's information. If you want to update a status, you must have Admin priviledges and use PATCH /hacker/status/:id.</p>",
      "name": "patchHacker",
      "group": "Hacker",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "school",
              "description": "<p>Name of the school the hacker goes to</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "gender",
              "description": "<p>Gender of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Boolean",
              "optional": true,
              "field": "needsBus",
              "description": "<p>Whether the hacker requires a bus for transportation</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": true,
              "field": "ethnicity",
              "description": "<p>the ethnicities of the hacker</p>"
            },
            {
              "group": "body",
              "type": "String[]",
              "optional": true,
              "field": "major",
              "description": "<p>the major of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Number",
              "optional": true,
              "field": "graduationYear",
              "description": "<p>the graduation year of the hacker</p>"
            },
            {
              "group": "body",
              "type": "Json",
              "optional": true,
              "field": "application",
              "description": "<p>The hacker's application</p>"
            }
          ]
        },
        "examples": [{
          "title": "application: ",
          "content": "{\n               \"portfolioURL\":{\n                   \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                   \"github\":\"https://github.com/abcd\",\n                   \"dropler\":\"https://dribbble.com/abcd\",\n                   \"personal\":\"https://www.hi.com/\",\n                   \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                   \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n               },\n               \"jobInterest\":\"Internship\",\n               \"skills\":[\"Javascript\",\"Typescript\"],\n               \"comments\":\"hi!\",\n               \"essay\":\"Pls accept me\"\n           }",
          "type": "Json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Changed hacker information\", \n    \"data\": {\n                   \"id\":\"5bff4d736f86be0a41badb91\",\n                   \"application\":{\n                       \"portfolioURL\":{\n                           \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                           \"github\":\"https://github.com/abcd\",\n                           \"dropler\":\"https://dribbble.com/abcd\",\n                           \"personal\":\"https://www.hi.com/\",\n                           \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                           \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                       },\n                       \"jobInterest\":\"Internship\",\n                       \"skills\":[\"Javascript\",\"Typescript\"],\n                       \"comments\":\"hi!\",\n                       \"essay\":\"Pls accept me\"\n                   },\n                   \"status\":\"Applied\",\n                   \"ethnicity\":[\"White or Caucasian\",\" Asian or Pacific Islander\"],\n                   \"accountId\":\"5bff2a35e533b0f6562b4998\",\n                   \"school\":\"McPherson College\",\n                   \"gender\":\"Female\",\n                   \"needsBus\":false,\n                   \"major\":\"Accounting\",\n                   \"graduationYear\":2019,\n                   \"codeOfConduct\":true,\n}",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while updating hacker\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/:id"
      }]
    },
    {
      "type": "patch",
      "url": "/hacker/confirmation/:id",
      "title": "Allows confirmation of hacker attendence if they are accepted. Also allows change from 'confirmed' to 'cancelled'.",
      "name": "patchHackerConfirmed",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "body": [{
            "group": "body",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>The new status of the hacker. &quot;Accepted&quot;, &quot;Confirmed&quot;, or &quot;Cancelled&quot;</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Changed hacker information\", \n    \"data\": {\n        \"status\": \"Confirmed\"\n    }\n}",
          "type": "object"
        }]
      },
      "permission": [{
          "name": "Administrator"
        },
        {
          "name": "Hacker"
        }
      ],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/confirmation/:id"
      }]
    },
    {
      "type": "patch",
      "url": "/hacker/status/:id",
      "title": "update a hacker's status",
      "name": "patchHackerStatus",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "body": [{
            "group": "body",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>Status of the hacker's application (&quot;None&quot;|&quot;Applied&quot;|&quot;Waitlisted&quot;|&quot;Confirmed&quot;|&quot;Cancelled&quot;|&quot;Checked-in&quot;)</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Changed hacker information\", \n    \"data\": {\n        \"status\": \"Accepted\"\n    }\n}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": "Administrator"
      }],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/status/:id"
      }]
    },
    {
      "type": "post",
      "url": "/hacker/resume/:id",
      "title": "upload or update resume for a hacker.",
      "name": "postHackerResume",
      "group": "Hacker",
      "version": "0.0.8",
      "description": "<p><b>NOTE: This must be sent via multipart/form-data POST request</b></p>",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>Hacker id</p>"
          }],
          "body": [{
            "group": "body",
            "type": "File",
            "optional": false,
            "field": "resume",
            "description": "<p>The uploaded file.</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Location in the bucket that the file was stored.</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "HTTP/1.1 200 OK\n{\n    message: \"Uploaded resume\", \n    data: {\n        filename: \"resumes/1535032624768-507f191e810c19729de860ea\"\n    }\n}",
          "type": "json"
        }]
      },
      "permission": [{
        "name": "Must be logged in, and the account id must be linked to the hacker."
      }],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/resume/:id"
      }]
    },
    {
      "type": "post",
      "url": "/hacker/email/weekOf/:id",
      "title": "",
      "description": "<p>Sends a hacker the week-of email, along with the HackPass QR code to view their hacker profile (for checkin purposes). Hackers must be eitherconfirmed, or checked in.</p>",
      "name": "postHackerSendWeekOfEmail",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>The hacker ID</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Hacker week-of email sent.\", \n    \"data\": {}\n}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": "Administrator"
      }],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/email/weekOf/:id"
      }]
    },
    {
      "type": "post",
      "url": "/hacker/email/weekOf/:id",
      "title": "",
      "description": "<p>Sends a hacker the week-of email, along with the HackPass QR code to view their hacker profile (for checkin purposes). Hackers must be eitherconfirmed, or checked in.</p>",
      "name": "postHackerSendWeekOfEmail",
      "group": "Hacker",
      "version": "0.0.9",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>The hacker ID</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Hacker week-of email sent.\", \n    \"data\": {}\n}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": "Administrator"
      }],
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/email/weekOf/:id"
      }]
    },
    {
      "type": "get",
      "url": "/sponsor/self",
      "title": "get information about logged in sponsor",
      "name": "self",
      "group": "Hacker",
      "version": "1.4.1",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Sponsor object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved sponsor information\", \n               \"data\": {\n                   \"id\": \"5bff4d736f86be0a41badb91\",\n                   \"accountId\": \"5bff4d736f86be0a41badb99\",\n                   \"tier\": 3,\n                   \"company\": \"companyName\",\n                   \"contractURL\": \"https://www.contractHere.com\",\n                   \"nominees\": [\"5bff4d736f86be0a41badb93\",\"5bff4d736f86be0a41badb94\"]\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Sponsor not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": ": Sponsor"
      }],
      "filename": "routes/api/sponsor.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/sponsor/self"
      }]
    },
    {
      "type": "get",
      "url": "/hacker/self",
      "title": "get information about own hacker",
      "name": "self",
      "group": "Hacker",
      "version": "0.0.8",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Hacker object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Hacker found by logged in account id\", \n               \"data\": {\n                   \"id\":\"5bff4d736f86be0a41badb91\",\n                   \"application\":{\n                       \"portfolioURL\":{\n                           \"resume\":\"resumes/1543458163426-5bff4d736f86be0a41badb91\",\n                           \"github\":\"https://github.com/abcd\",\n                           \"dropler\":\"https://dribbble.com/abcd\",\n                           \"personal\":\"https://www.hi.com/\",\n                           \"linkedIn\":\"https://linkedin.com/in/abcd\",\n                           \"other\":\"https://github.com/hackmcgill/hackerAPI/issues/168\"\n                       },\n                       \"jobInterest\":\"Internship\",\n                       \"skills\":[\"Javascript\",\"Typescript\"],\n                       \"comments\":\"hi!\",\n                       \"essay\":\"Pls accept me\"\n                   },\n                   \"status\":\"Applied\",\n                   \"ethnicity\":[\"White or Caucasian\",\" Asian or Pacific Islander\"],\n                   \"accountId\":\"5bff2a35e533b0f6562b4998\",\n                   \"school\":\"McPherson College\",\n                   \"gender\":\"Female\",\n                   \"needsBus\":false,\n                   \"major\":[\"Accounting\"],\n                   \"graduationYear\":2019,\n                   \"codeOfConduct\":true,\n               }  \n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Hacker not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/hacker.js",
      "groupTitle": "Hacker",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/hacker/self"
      }]
    },
    {
      "type": "get",
      "url": "/",
      "title": "version",
      "version": "0.0.8",
      "name": "index",
      "group": "Index",
      "permission": [{
        "name": "public"
      }],
      "filename": "routes/index.js",
      "groupTitle": "Index",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/"
      }]
    },
    {
      "type": "post",
      "url": "/api/role/",
      "title": "create a new role",
      "name": "createRole",
      "group": "Role",
      "version": "1.1.1",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>Name of the route</p>"
            },
            {
              "group": "body",
              "type": "Route[]",
              "optional": false,
              "field": "routes",
              "description": "<p>The routes that this role gives access to</p>"
            }
          ]
        },
        "examples": [{
          "title": "application: ",
          "content": "{\n               \"name\": \"routename\",\n               \"routes\": [\n                   {\n                       uri: \"/api/hacker/\"\n                       requestType: \"POST\"\n                   }\n               ]\n}",
          "type": "Json"
        }]
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Role object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Role creation successful\", \n    \"data\": {\n                   \"name\": \"routename\",\n                   \"routes\": [\n                       {\n                           uri: \"/api/hacker/\"\n                           requestType: \"POST\"\n                       }\n                   ]\n    }\n}",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while creating role\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/role.js",
      "groupTitle": "Role",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/api/role/"
      }]
    },
    {
      "type": "get",
      "url": "/search/",
      "title": "provide a specific query for any defined model",
      "name": "search",
      "group": "Search",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "query": [{
              "group": "query",
              "type": "String",
              "optional": false,
              "field": "model",
              "description": "<p>the model to be searched</p>"
            },
            {
              "group": "query",
              "type": "Array",
              "optional": false,
              "field": "q",
              "description": "<p>the query to be executed. For more information on how to format this, please see https://docs.mchacks.ca/architecture/</p>"
            },
            {
              "group": "query",
              "type": "String",
              "optional": false,
              "field": "sort",
              "description": "<p>either &quot;asc&quot; or &quot;desc&quot;</p>"
            },
            {
              "group": "query",
              "type": "number",
              "optional": false,
              "field": "page",
              "description": "<p>the page number that you would like</p>"
            },
            {
              "group": "query",
              "type": "number",
              "optional": false,
              "field": "limit",
              "description": "<p>the maximum number of results that you would like returned</p>"
            },
            {
              "group": "query",
              "type": "any",
              "optional": false,
              "field": "sort_by",
              "description": "<p>any parameter you want to sort the results by</p>"
            },
            {
              "group": "query",
              "type": "boolean",
              "optional": false,
              "field": "expand",
              "description": "<p>whether you want to expand sub documents within the results</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Results</p>"
            }
          ]
        },
        "examples": [{
            "title": "Success-Response:",
            "content": "{\n               \"message\": \"Successfully executed query, returning all results\",\n               \"data\": [\n                   {...}\n               ]\n           }",
            "type": "object"
          },
          {
            "title": "Success-Response:",
            "content": "{\n               \"message\": \"No results found.\",\n               \"data\": {}\n           }",
            "type": "object"
          }
        ]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response:",
          "content": "{\"message\": \"Validation failed\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/search.js",
      "groupTitle": "Search",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/search/"
      }]
    },
    {
      "type": "get",
      "url": "/settings/",
      "title": "Get the settings for the current hackathon",
      "name": "getSettings",
      "group": "Settings",
      "version": "1.1.1",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Settings Object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Settings creation successful.\", \n    \"data\": {\n        \"settings\": {\n            openTime: \"Wed Feb 06 2019 00:00:00 GMT-0500 (GMT-05:00)\",\n            closeTime: \"Sat Feb 01 2020 00:00:00 GMT-0500 (GMT-05:00)\",\n            confirmTime: \"Sat Feb 20 2020 00:00:00 GMT-0500 (GMT-05:00)\"\n        }\n    }\n}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": "public"
      }],
      "filename": "routes/api/settings.js",
      "groupTitle": "Settings",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/settings/"
      }]
    },
    {
      "type": "patch",
      "url": "/settings/",
      "title": "Patch the settings for the current hackathon",
      "name": "patchSettings",
      "group": "Settings",
      "version": "1.1.1",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "Date",
              "optional": true,
              "field": "openTime",
              "description": "<p>The opening time for the hackathon.</p>"
            },
            {
              "group": "body",
              "type": "Date",
              "optional": true,
              "field": "closeTime",
              "description": "<p>The closing time for the hackathon.</p>"
            },
            {
              "group": "body",
              "type": "Date",
              "optional": true,
              "field": "confirmTime",
              "description": "<p>The deadline for confirmation for the hackathon.</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Settings Object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Settings patch successful.\", \n    \"data\": {\n        \"settings\": {\n            openTime: \"Wed Feb 06 2019 00:00:00 GMT-0500 (GMT-05:00)\",\n            closeTime: \"Sat Feb 01 2020 00:00:00 GMT-0500 (GMT-05:00)\",\n            confirmTime: \"Sat Feb 20 2020 00:00:00 GMT-0500 (GMT-05:00)\"\n        }\n    }\n}",
          "type": "object"
        }]
      },
      "permission": [{
        "name": "Administrators"
      }],
      "filename": "routes/api/settings.js",
      "groupTitle": "Settings",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/settings/"
      }]
    },
    {
      "type": "post",
      "url": "/sponsor/",
      "title": "create a new sponsor",
      "name": "createSponsor",
      "group": "Sponsor",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "MongoID",
              "optional": false,
              "field": "accountId",
              "description": "<p>ObjectID of the respective account.</p>"
            },
            {
              "group": "body",
              "type": "Number",
              "optional": false,
              "field": "tier",
              "description": "<p>Tier of the sponsor, from 0 to 5. 0 is lowest tier, and 5 is the custom tier.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "company",
              "description": "<p>Name of the company.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "contractURL",
              "description": "<p>URL link to the contract with the company.</p>"
            },
            {
              "group": "body",
              "type": "MongoID[]",
              "optional": false,
              "field": "nominees",
              "description": "<p>Array of accounts that the company wish to nominate as hackers.</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Sponsor object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Sponsor creation successful\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while creating sponsor\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/sponsor.js",
      "groupTitle": "Sponsor",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/sponsor/"
      }]
    },
    {
      "type": "get",
      "url": "/sponsor/:id",
      "title": "get a sponsor's information",
      "name": "getSponsor",
      "group": "Sponsor",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>a sponsor's unique mongoID</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Sponsor object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved sponsor information\", \n               \"data\": {\n                   \"id\": \"5bff4d736f86be0a41badb91\",\n                   \"accountId\": \"5bff4d736f86be0a41badb99\",\n                   \"tier\": 3,\n                   \"company\": \"companyName\",\n                   \"contractURL\": \"https://www.contractHere.com\",\n                   \"nominees\": [\"5bff4d736f86be0a41badb93\",\"5bff4d736f86be0a41badb94\"]\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Sponsor not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/sponsor.js",
      "groupTitle": "Sponsor",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/sponsor/:id"
      }]
    },
    {
      "type": "patch",
      "url": "/sponsor/",
      "title": "update a sponsor",
      "name": "patchSponsor",
      "group": "Sponsor",
      "version": "1.3.0",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>ObjectID of the sponsor</p>"
          }],
          "body": [{
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "company",
              "description": "<p>Name of the company.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "contractURL",
              "description": "<p>URL link to the contract with the company.</p>"
            },
            {
              "group": "body",
              "type": "ObjectId[]",
              "optional": false,
              "field": "nominees",
              "description": "<p>Array of accounts that the company wish to nominate as hackers.</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Sponsor object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Sponsor update successful\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while updating sponsor\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/sponsor.js",
      "groupTitle": "Sponsor",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/sponsor/"
      }]
    },
    {
      "type": "post",
      "url": "/team/",
      "title": "create a new team consisting of only the logged in user",
      "name": "createTeam",
      "group": "Team",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
              "group": "body",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>Name of the team.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "devpostURL",
              "description": "<p>Devpost link to hack. Once the link is sent, the hack will be considered to be submitted.</p>"
            },
            {
              "group": "body",
              "type": "String",
              "optional": true,
              "field": "projectName",
              "description": "<p>Name of the team.</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Team object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Team creation successful\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while creating team\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/team.js",
      "groupTitle": "Team",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/team/"
      }]
    },
    {
      "type": "patch",
      "url": "/team/leave/",
      "title": "Allows a logged in hacker to leave current team",
      "name": "deleteSelfFromTeam",
      "group": "Team",
      "version": "1.1.1",
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>{}</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Removal from team successful.\", \n    \"data\": {}\n}",
          "type": "object"
        }]
      },
      "filename": "routes/api/team.js",
      "groupTitle": "Team",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/team/leave/"
      }]
    },
    {
      "type": "get",
      "url": "/team/:id",
      "title": "get a team's information",
      "name": "getTeam",
      "group": "Team",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>MongoId of the team</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Team object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Team retrieval successful\", \n               \"data\": {        \n                   \"team\": {\n                       \"name\":\"foo\",\n                       \"members\": [\n                           ObjectId('...')\n                       ],\n                       \"devpostURL\": \"www.devpost.com/foo\",\n                       \"projectName\": \"fooey\"\n                   },\n                   \"members\": [\n                       {\n                           \"firstName\": \"John\",\n                           \"lastName\": \"Doe\"\n                       }\n                   ],\n               }\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Team not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/team.js",
      "groupTitle": "Team",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/team/:id"
      }]
    },
    {
      "type": "patch",
      "url": "/team/join/",
      "title": "Allows a logged in hacker to join a team by name",
      "name": "patchJoinTeam",
      "group": "Team",
      "version": "1.1.1",
      "parameter": {
        "fields": {
          "body": [{
            "group": "body",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>Name of the team to join</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>{}</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n    \"message\": \"Team join successful.\", \n    \"data\": {}\n}",
          "type": "object"
        }]
      },
      "filename": "routes/api/team.js",
      "groupTitle": "Team",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/team/join/"
      }]
    },
    {
      "type": "patch",
      "url": "/team/:hackerId",
      "title": "Update a team's information. The team is specified by the hacker belonging to it.",
      "name": "patchTeam",
      "group": "Team",
      "version": "0.0.8",
      "description": "<p>We use hackerId instead of teamId because authorization requires a one-to-one mapping from param id to accountId, but we are not able to have that from teamId to accountId due to multiple members in a team. Instead, we use hackerId, as there is a 1 to 1 link between hackerId to teamId, and a 1 to 1 link between hackerId and accountId</p>",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "hackerId",
            "description": "<p>a hacker's unique Id</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Team object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Team update successful.\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Query input that caused the error.</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Team not found\", \"data\": {teamId}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/team.js",
      "groupTitle": "Team",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/team/:hackerId"
      }]
    },
    {
      "type": "post",
      "url": "/volunteer/",
      "title": "create a new volunteer",
      "name": "createVolunteer",
      "group": "Volunteer",
      "version": "0.0.8",
      "parameter": {
        "fields": {
          "body": [{
            "group": "body",
            "type": "MongoID",
            "optional": false,
            "field": "accountId",
            "description": "<p>MongoID of the account of the volunteer</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>Volunteer object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Volunteer creation successful\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "string",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Error while creating volunteer\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/volunteer.js",
      "groupTitle": "Volunteer",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/volunteer/"
      }]
    },
    {
      "type": "get",
      "url": "/volunteer/:id",
      "title": "get a volunteer's information",
      "name": "getVolunteer",
      "group": "Volunteer",
      "version": "1.3.0",
      "parameter": {
        "fields": {
          "param": [{
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>a volunteer's unique mongoID</p>"
          }]
        }
      },
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Success message</p>"
            },
            {
              "group": "Success 200",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>Volunteer object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response: ",
          "content": "{\n               \"message\": \"Successfully retrieved volunteer information\", \n               \"data\": {...}\n           }",
          "type": "object"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
              "group": "Error 4xx",
              "type": "String",
              "optional": false,
              "field": "message",
              "description": "<p>Error message</p>"
            },
            {
              "group": "Error 4xx",
              "type": "Object",
              "optional": false,
              "field": "data",
              "description": "<p>empty</p>"
            }
          ]
        },
        "examples": [{
          "title": "Error-Response: ",
          "content": "{\"message\": \"Volunteer not found\", \"data\": {}}",
          "type": "object"
        }]
      },
      "filename": "routes/api/volunteer.js",
      "groupTitle": "Volunteer",
      "sampleRequest": [{
        "url": "https://api.mchacks.ca/api/volunteer/:id"
      }]
    }
  ]
});