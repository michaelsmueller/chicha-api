# Chicha API

## Instructions how to start

Create `.env` file like the example `.env.sample`.

Start with `npm start-dev`.

go to **http://localhost:5000** (or whatever port you've configured in `.env`)

## Description

Find, share and upvote your favorite things to do in Barcelona.

## Motivation

Crowdsource the best local events from knowledgable locals motivated to share and also get rewards from local businesses.

## Routes

### Auth endpoints

| Method  | Path                  | Description       | Body                               |
| :----:  | ----------------      | ----------------  | ------------------------------     |
|  GET    | `/whoami`             | who am I          |                                    |
|  POST   | `/signin`             | sign in user      | `{ username, password }`    |
|  GET    | `/logout`             | logout session    |                                    |

### User endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  POST   | `/users/`             | create user            | `{ username, password, image, description, url }` |
|  GET    | `/users/:id`          | read user              |                                    |
|  PUT    | `/users/:id`          | update user            | `{ username, password, image, description, url }` |
|  DELETE | `/users/:id`          | delete user            |                                    |
|  GET    | `/users/heavyweights` | read heavyweights      |                                    |
|  GET    | `/users/:id/vouchers` | read vouchers          |                                    |

### Event endpoints
    
| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  GET    | `/events`             | list of events         |                                    |
|  POST   | `/events`             | create event           | `{ facebook_id, name, cover, description, start_time, end_time, place }` |
|  GET    | `/events/:id`         | read event             |                                    |
|  PUT    | `/events/:id`         | update event           | `{ facebook_id, name, cover, description, start_time, end_time, place }` |
|  PATCH  | `/events/:id/vote`    | upvote /downvote event | `{ vote }`                         |
|  DELETE | `/events/:id`         | delete event           |                                    |
    
### Offers endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  GET    | `/offers`             | list of offers         |                                    |
|  GET    | `/offers/:id`         | read offer             |                                    |

## Models

### User model

```javascript
{
	username: String,
	hashed_password: String,
	image: String,
	description: String,
	url: String,
	points: Number,
	balance: Number,
	vouchers: [ ObjectId<Offer> ]
}
```

### Event model

```javascript
{
	creator: ObjectId<User>,
	facebook_id: String,
	name: String,
	cover: String,
	description: String,
	start_time: Date,
	end_time: Date,
	place: {
		facebook_id: String,
		name: String,
		location: {
			city: String,
			country: String,
			latitude: Number,
			longitude: Number,
			street: String,
			zip: String,
		}
	},
	upvotes: Number,
	downvotes: Number,
}
```

### Offer model

```javascript
{
	merchant: String,
	image: String,
	description: String,
	point_cost: Number,
}
```

## Links

### Trello

[Trello board](https://trello.com/b/O8DhDgcu/chicha)

### Git

[GitHub repository - API](https://github.com/michaelsmueller/chicha-api)

[GitHub repository - frontend](https://github.com/michaelsmueller/chicha)

