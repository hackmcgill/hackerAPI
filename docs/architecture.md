# HackerAPI's architecture

## Frameworks and libraries used

This whole application was built off of [Node.js](https://nodejs.org/en/)!

### Routing

We use [Express.js](https://expressjs.com/) to help us with routing.

### Authentication

We use a `LocalStrategy` within Passport.js to authenticate a login session. Given an active session, the user must have a token called `session` in their cookies which was given by the api in order to continue accessing the api.

In addition, authentication is currently being transitioned from some custom architecture to a more classic RBAC model, so that we are able to only allow access to certain routes given a user has a specific role.

### Testing

We use [Mocha](https://mochajs.org/) with [Chai](https://www.chaijs.com/) to test our routes and services.

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
|-----------|----------------------------------------------------|
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
