define({ "api": [
  {
    "type": "post",
    "url": "/auth/password/forgot",
    "title": "forgot password route",
    "name": "forgotPassword",
    "group": "Authentication",
    "version": "0.0.8",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the email address of the account</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{ \"email\": \"myemail@mchacks.ca\" }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
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
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "{\"message\": \"Sent reset email\", \"data\": {}}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/auth.js",
    "groupTitle": "Authentication"
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
        "Parameter": [
          {
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
        "Success 200": [
          {
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
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully logged in\", \"data\": {}}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
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
      "examples": [
        {
          "title": "Error-Response: ",
          "content": "{\"message\": \"Invalid email or password\", \"data\": {}}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/auth.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "https://mchacks.ca/api/auth/login"
      }
    ]
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
        "Success 200": [
          {
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
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully logged out\", \"data\": {}}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/auth.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "https://mchacks.ca/api/auth/logout"
      }
    ]
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
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the password of the account</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{ \"password\": \"hunter2\" }",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authentication",
            "description": "<p>the token that was provided in the reset password email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authentication\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
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
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "{\"message\": \"Successfully reset password\", \"data\": {}}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/hacker/:id/resume",
    "title": "get the resume for a hacker.",
    "name": "getHackerResume",
    "group": "Hacker",
    "version": "0.0.8",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>Hacker id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK \n{ \n    message: \"Downloaded resume\", \n    data: { \n        id: \"507f191e810c19729de860ea\", \n        resume: [Buffer] \n    } \n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "Must be logged in, and the account id must be linked to the hacker."
      }
    ],
    "filename": "routes/api/hacker.js",
    "groupTitle": "Hacker"
  },
  {
    "type": "post",
    "url": "/hacker/:id/resume",
    "title": "upload or update resume for a hacker.",
    "name": "postHackerResume",
    "group": "Hacker",
    "version": "0.0.8",
    "description": "<p><b>NOTE: This must be sent via multipart/form-data POST request</b></p>",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>Hacker id</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "File",
            "optional": false,
            "field": "resume",
            "description": "<p>The uploaded file.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
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
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP/1.1 200 OK\n{\n    message: \"Uploaded resume\", \n    data: {\n        filename: \"resumes/1535032624768-507f191e810c19729de860ea\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "Must be logged in, and the account id must be linked to the hacker."
      }
    ],
    "filename": "routes/api/hacker.js",
    "groupTitle": "Hacker",
    "sampleRequest": [
      {
        "url": "https://mchacks.ca/api/hacker/:id/resume"
      }
    ]
  },
  {
    "type": "get",
    "url": "/",
    "title": "version",
    "version": "0.0.8",
    "name": "index",
    "group": "Index",
    "permission": [
      {
        "name": "none needed"
      }
    ],
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "sampleRequest": [
      {
        "url": "https://mchacks.ca/api/"
      }
    ]
  }
] });
