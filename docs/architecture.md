# HackerAPI's architecture

## Frameworks and libraries used

This whole application was built off of [Node.js](https://nodejs.org/en/)!

### Routing

We use [Express.js](https://expressjs.com/) to help us with routing.

### Authentication library

We use a `LocalStrategy` within Passport.js to authenticate a login session. Given an active session, the user must have a token called `session` in their cookies which was given by the api in order to continue accessing the api.

For authorization, we decided to write a custom RBAC-esque strategy. Check below for specifics on how it works, and how to work with it, and how to use it when extending this project.

### Testing

We use [Mocha](https://mochajs.org/) with [Chai](https://www.chaijs.com/) to test our routes and services.

## Authorization

Before you read this section, it's important to understand the difference between `Authentication` and `Authorization`. The first asks the question: _"Do we know who you are?"_ (i.e. are you logged in?), whereas the second asks the question: _"Do you have sufficient permissions to be making this request?"_.

We use a custom implementation for authorization, which relies heavily on the design of Role-based access control.

### Definitions

#### `Route`

A `Route`, which is a component of a `Role`, is defined by its uri path, its query parameters in the uri path, and the HTTP verb used to access it:

```json
{
    "uri": "/api/sponsor/",
    "requestType": "POST",
}
```

#### `Role`

A `Role` is a collection of `Routes`, and a unique name (such as `hacker`, or `sponsor`, or `my-custom-role`). This collection of `Routes` should approximately encapsulate the set of actions that a user of the api should be able to do. For example, a `Hacker` might want to have access to `GET /api/hacker/507f1f77bcf86cd799439011` (get their own information), or `POST /api/hacker/` (create their hacker document):

```json
{
    "Name": "sponsor",
    "routes": [{
        "uri": "/api/sponsor/",
        "requestType": "POST"
    }]
}
```

_Note here that the parameter `routes` is a list of `Route` objects described in the previous section._

#### `RoleBinding`

A `RoleBinding` is a mapping between an `account` and a `Role`. In this way, we can say that an account has a certain set of allowed actions, defined by the `Role`. An `account` can have a `RoleBinding` to multiple `Roles`.

```json
{
    "accountId": "507f191e810c19729de860ea",
    "roles": ["54759eb3c090d83494e2d804", "51325eb3c090d83494e2d702"],
}
```

_note here that `roles` is a list of `ObjectIds`, since the role is also a document in the database._

### How to write a `Route` document

In order to encapsulate permissions based on the actual `params` of a given route (such as the resource id in `/api/hacker/507f1f77bcf86cd799439011`), we use two placeholders: `:self`, and `:all`. These two placeholders replace the location of the given parameter in the route; in the example above, we would translate the uri to either `/api/hacker/:self`, or `/api/hacker/:all`.

#### `:self`

The `self` placeholder provides the account that hits this `Route` access to only the resource that is related to this particular accountId. For example, if I wanted to hit `GET /api/hacker/507f1f77bcf86cd799439011`, then the hacker whose `id` was `507f1f77bcf86cd799439011` would have to have an `accountId` that is equal to the `id` of the account accessing this resource.

#### `:all`

The `all` placeholder provides the account that hits this `Route` access to any resource for a given id.

#### Chaining :self and :all

It is possible to chain `:self` and `:all` together if need-be. An example of chaining is either: `/:self/:all`, or `/:all/:all`, etc.

### Adding Authentication and Authorization to your middleware

We've tried to make this as simple and abstract as possible. To add `Authentication`, you just need to import the `Auth` module file, and then insert into the route definition:

```javascript
const Middleware = {
    Auth: require("../../middlewares/auth.middleware")
};
...
hackerRouter.route("/").post(
    Middleware.Auth.ensureAuthenticated(),
    // Whatever middleware is after this will run only if the user is authenticated.
);
```

To add `Authorization`, you will need to import the `Auth` module file, and then insert into the route definition, just like `Authentication`. However, if there are route parameters, you will need to also provide as arguments an array which contains the functions required to access the given parameters. There must be a one-to-one mapping between route parameters and function inputs. An example is below:

```javascript
const Middleware = {
    Auth: require("../../middlewares/auth.middleware")
};
const Services = {
    Hacker: require("../../services/hacker.service"),
}
...
// some made-up route that allows a hacker to 'friend' another hacker
hackerRouter.route("/:id1/friend/:id2/").get(
    Middleware.Auth.ensureAuthenticated(),
    Middleware.Auth.ensureAuthorized([Services.Hacker.findById, Services.Hacker.findById]),
    // Whatever middleware is after this will run only if the user is authenticated AND has sufficient permissions to access this route.
);
```

Here, we note that we pass in one function for `id1`, and one function for `id2`.

The method signature for the inputted functions must be: `(parameter) => {accountId:string} | {_id:string}`.

### Limitations

There are some limitations to this authorization method:

* You can only specify access to a related resource, or to all resources. As such, it is currently not possible to give a user access to some arbitrary set of resources. This might come in a later version of this authorization service.

## Searching

More complex searches on models are available on our API. We provide a subset of the mongoose query language that allows you to quickly get results for a given model. On our `search/` route, just assign `q` to your query in your query parameters.

### Structure of your query

The search query is strucutered as a series of param, operation, value objects (P.O.V.) passed into the `/search/:model` route:

```json
[
    {"param": "a", "operation":"...", "value":"..."},
    {"param": "b", "operation":"...", "value":"..."},
    {"param": "c", "operation":"...", "value":"..."},
    {"param": "d", "operation":"...", "value":"..."}
]
```

Where `param` is the parameter you want to search by (email, age, gender, etc.), `operation` is valid for the type you are conducting the search on:

| Type      | Operations                                         |
| --------- | -------------------------------------------------- |
| `String`  | `['equals', 'ne', 'regex', 'in']`                  |
| `Number`  | `['equals', 'ne', 'gte', 'lte', 'le', 'ge', 'in']` |
| `Boolean` | `['equals', 'ne']`                                 |

`value` is the value that you want to compare entries in the DB against.

An example query to find all hackers whose email ends with `@mail.mcgill.ca` would be:

```json
[{"param":"email", "operation":"regex", "value":".+@mail.mcgill.ca"}]
```

Sequential P.O.V.s are chained together using an `and` operator. There currently is no functionality for chaining them as `or`. To find all hackers whose email ends with `@mail.mcgill.ca` and were checked in, the query would be:

```json
[
    {"param":"email", "operation":"regex", "value":".+@mail.mcgill.ca"},
    {"param":"status", "operation":"equals", "value":"Checked-in"}
]
```

The http request that this would translate to is:

```http
/api/search/hacker?q=%5B%7B%22param%22%3A%22email%22%2C%20%22operation%22%3A%22regex%22%2C%20%22value%22%3A%22.%2B%40mail.mcgill.ca%22%7D%2C%7B%22param%22%3A%22status%22%2C%20%22operation%22%3A%22equals%22%2C%20%22value%22%3A%22Checked-in%22%7D%5D
```
