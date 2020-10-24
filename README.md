# CryptoGame Backend

## General API Information
* All endpoints return a JSON object with the following format

```javascript
// If everything went ok
{
  data: [{...}],
  error: null
}

// In case of an error occours
{
  data: null,
  error: "Error message"
}
```

## HTTP Return Codes
* HTTP `400` return code is used for malformed requests; the issue is on the sender's side.
* HTTP `401` return code is used when trying to access a protected endpoint without providing a JWT.
* HTTP `403` return code is used when trying to access a protected endpoint with an invalid JWT.
* HTTP `500` return code is used for internal errors; the issue is on the API side.

## Public API Endpoints

### Register

```
POST /register
```

Registers a new user.

**Parameters:**

```javascript
{
  "email" : "valid@email.com",
  "name" : "Username",
  "password" : "anypassword"
}
```

**Response:**

```javascript
{
  "data": "Congratulation, you have successfully registered!",
  "error": null
}
```

### Login

```
POST /login
```

Returns a JWT for an existing user.

**Parameters:**

```javascript
{
  "email" : "registered@email.com",
  "password" : "validpassword"
}
```

**Response:**

```javascript
{
  "data": {
    "accessToken": "...",
    "role": 0 // 0 for normal users, 1 for admin users
  },
  "error": null
}
```

## Protected API Endpoints
