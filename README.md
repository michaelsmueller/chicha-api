# Chicha API

## How to start

Create an `.env` file following the example `.env.sample`. You'll need a Facebook account and your access token (best to exchange it for a long-term token) to a Facebook app that has been granted `user_events` permissions.

Start API server with `npm start-dev`.

Go to **http://localhost:5000** (or whatever port configured in `.env`)

Make sure to start the frontend server in another tab (see instructions in frontend Github repository, link below).

## Description

Discover the city's best events!

## Motivation

Every day thousands of people search for "**things to do near me**" in search engines. Chicha is a **better way** for users to find great local things to do, while at the same time **supporting local** creators and businesses.

Chicha connects users, tastemakers and local businesses: 
- **Users** view, sort and filter a list of events as well as add and vote on events.
- **Tastemakers** such as artists, bloggers and promoters ("heavies") who share the most gain visibility and influence.
- **Local businesses** attract more customers through coupons that users and tastemakers earn on the platform.

Check the GitHub frontend repository (see link below) for more info on how the website works.

## Routes

### Auth endpoints

| Method  | Path                  | Description       | Body                               |
| :----:  | ----------------      | ----------------  | ------------------------------     |
|  GET    | `/whoami`             | who am I          |                                    |
|  POST   | `/signin`             | sign in user      | `{ username, password }`           |
|  GET    | `/logout`             | logout session    |                                    |

### User endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  POST   | `/users/`             | create user            | `{ username, password }`           |
|  GET    | `/users/:id`          | read user              |                                    |
|  PUT    | `/users/:id`          | update user            | `{ username, password, image, bio, url }` |
|  DELETE | `/users/:id`          | delete user            |                                    |
|  GET    | `/users/heavies`      | read heavies           |                                    |
|  PATCH  | `/users/:id/coupons`  | add coupon to user     | `{ offer: { _id, partner, image, description, cost } }`           |
|  GET    | `/users/find?coupon=:couponid`  | get user who has coupon     |                      |
|  PATCH  | `/users/:id/coupons/:couponid`  | redeem user's coupon        |                      |

### Offers endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  GET    | `/offers`             | list of offers         |                                    |
|  GET    | `/offers/:id`         | read offer             |                                    |

### Event endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  POST   | `/events`             | create event           | `{ url }`                          |
|  GET    | `/events`             | list of events         |                                    |
|  GET    | `/events/:id`         | read event             |                                    |
|  PUT    | `/events/:id`         | update event           | `{ event: { data: { name, cover: { source }, start_time, end_time, description, ticket_uri, place: { name: place, location: { street, city, country: 'Spain', latitude, longitude } } }` |
|  DELETE | `/events/:id`         | delete event           |                                    |
|  GET    | `/events/search?query=:query` | search events  |                                    |

### Vote endpoints

| Method  | Path                  | Description            | Body                               |
| :----:  | ----------------      | ----------------       | ------------------------------     |
|  POST   | `/votes/`             | create vote on event from user | ` { eventId, direction } ` |
|  GET    | `/votes`        		  | read votes by user on events   |                            |
|  PUT    | `/votes/:id`          | change vote by user on event   | ` { eventId, direction } ` |
|  DELETE | `/votes/:id?eventid=:eventid&direction=:direction` | delete vote  |                 |

## Models

### User model

```javascript
{
	username: { type: String, required: true, unique: true, trim: true },
	hashed_password: { type: String, required: true },
	image: { type: String, default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' },
	bio: { type: String },
	url: { type: String },
	points: { type: Number, default: 0 },
	balance: { type: Number, default: 0 },
	partner: { type: Boolean, default: false },
	coupons: [ 
		{
			offer: { type: Schema.Types.ObjectId, ref: 'Offer' },
			createdAt: { type: Date, default: new Date() },
			status: { type: String, default: 'valid' },
			redeemedOn: { type: Date },
		},
	],
},
```

### Event model

```javascript
{
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	votes: { type: Number, default: 0 },
	data: {
		id: { type: String },
		name: { type: String, required: true },
		cover: { source: { type: String } },
		attending_count: { type: Number },
		interested_count: { type: Number },
		start_time: { type: Date },
		end_time: { type: Date},
		description: { type: String },
		ticket_uri: { type: String },
		place: {
			name: { type: String },
			location: {
				street: { type: String },
				city: { type: String },
				country: { type: String },
				latitude: { type: Number },
				longitude: { type: Number },
			},
		},
	},
},
{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
},
```
### Vote model

```javascript
{
	voter: { type: Schema.Types.ObjectId, ref: 'User' },
	event: { type: Schema.Types.ObjectId, ref: 'Event' },
	direction: { type: Number, min: -1, max: 1 },
},
{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
}
```
### Offer model

```javascript
{
	partner: { type: String },
	image: { type: String },
	description: { type: String },
	cost: { type: Number },
},
{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
}
```

## Links

### Deployment

[API – Heroku](https://chicha-api.herokuapp.com)

[Frontend - Netlify](https://chicha.netlify.app)

### Presentation

[Google Slides](https://docs.google.com/presentation/d/1ZDxZknsIUCLrHTaYEsYjcc_06KRAZxgNZ9bg7SMssiY/edit#slide=id.p)

### Trello

[Trello board](https://trello.com/b/O8DhDgcu/chicha)

### Git

[GitHub repository - API](https://github.com/michaelsmueller/chicha-api)

[GitHub repository - frontend](https://github.com/michaelsmueller/chicha)

