# Machine
Conversation platform
Activate your content

A content-first approach to addresses the very challenging process of conversation (not chat)

## Features

* With Intent Recommendations, rather than manually training your Conversation Machine you can upload pre-existing chat or call logs. Machine will train based on real user questions and utterance, creating more accurate interactions for your customers. Additionally, using the logs, Machine will identify new topics and highlight gaps in training, through unsupervised machine learning. For instance, your customer base might be saying, “How do I cancel my card?” or “My card was stolen”, but your assistant doesn’t recognize “cancel card”. Watson will identify the new intent, “cancel card,”

* New out-of-the-box Intercom integration you can embed a Strategic Machine directly within your Intercom support channel as an additional member of your team. The Machine can collaborate with your human agents on customer interactions to provide suggestions, manage simple tasks autonomously, or give the agent full control of the conversation if the topics veers. The integration allows the Machine to save your customer service agents’ time – and your business dollars – by managing common or monotonous scenarios.

* When the user poses an ambiguous question or makes a request that could have multiple responses, the disambiguation feature prompts your Machine to ask the user for clarification. Rather than guessing the user’s intention, possibly incorrectly, your Machine shares a list of the top options, and asks the user to pick the right one. For instance, if a user says, “I need a new card”, the Strategic Machine will respond with “Would you like to: 1. Replace a broken card 2. Report a stolen card”, rather than assuming one action over the other.

## Getting Started

1. Clone this repository.
2. In a terminal window, start MongoDB as a replica set of one server with the command: `mongod --dbpath <DATA_PATH> --replSet "rs"`.
3. In a separate terminal window, run `mongo`, the MongoDB client.
4. If this is the first time you set up a replica set, execute the command `rs.initiate()`.
5. Create the database `tasksDb` (`use tasksDb`) and the collection `tasks` (`db.createCollection('tasks')`).
6. npm install
7. Navigate browser to end point and have a conversation

### Prerequisites

- [MongoDB (version 3.6 or superior)](https://www.mongodb.com/download-center#community)
- [Node.js (10 or superior)](https://nodejs.org/en/download/)
- [RedisLab or equivilant](https://redislabs.com/)

## Built With

* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [Node.js](https://nodejs.org/en/) - A JavaScript runtime 
* [React](https://reactjs.org/) - A JavaScript library for building webapps

## Modes

1. node server       for normal operation
2. node server no    for server without redis
3. node server train for server which trains classifier models from test data (`routes/atest`)
4. node server fast  for server function which reads, indexes and tests queries (`routes/aatest`)

Note by running in `node server test` mode a new classifier is created and stored for the bookstore, pizza shop and voting booth businesses. The training dataset is found at data/cbm

Any changes to the set of available functions in the CBM model (`config/cbm`) needs to be paired with updates to the training dataset so that functions can be reached based on intent  


## LICENSE
MIT

## agent
![demo](https://user-images.githubusercontent.com/31125521/36561436-fb278416-1813-11e8-8ff1-e15c61da88b5.gif)

## real-time access to vega datasets

instructions to read this in real-time
https://vega.github.io/vega-datasets/
https://github.com/vega/vega-datasets/tree/master/data
https://github.com/vega/vega-datasets/blob/master/sources.md
http://lib.stat.cmu.edu/datasets/
https://github.com/vega/vega


```javascript
import data from 'vega-datasets';

const cars = await data['cars.json']();
// equivalent to
// const cars = await (await fetch(data['cars.json'].url)).json();

console.log(cars);
```

## transfer to live agent - resolve ambiguous or urgent issues

Click to call an agent with tutorial - example app

https://github.com/gitjps/chatbot_phone_handover/tree/master/Twilio%20client%20click-to-call

## create conditional routing

// https://medium.com/blackmirror-media/bootstrap-your-express-js-app-conditional-middleware-4644aff6438f

## useful npm packages
// RETRY for db fetches and connections
// https://www.npmjs.com/package/async-retry

// Double Linked List - for when arrays get to big of MAPs can't be reverse
// https://www.npmjs.com/package/yallist

## JSON data stores
http://myjson.com/

https://any-api.com/

## google books
https://any-api.com/googleapis_com/books/docs/API_Description

## google calendar
https://developers.google.com/calendar/

## nteract
https://nteract.io/
code on top of jupyter notebooks

https://numfocus.org/

## cdn
https://www.cloudflare.com/

#netlify - retrieving raw contents of a file
https://www.netlify.com/docs/api/

https://scotch.io/tutorials/build-and-deploy-a-serverless-function-to-netlify

https://medium.com/netlify/jamstack-with-gatsby-netlify-and-netlify-cms-a300735e2c5d
https://www.donarita.co.uk/

https://www.netlifycms.org/

## netlify
https://app.netlify.com/sites/brave-bardeen-058f0a/overview
https://github.com/pdhoward/gatsby-starter-netlify-cms
https://www.netlifycms.org/docs/start-with-a-template

https://www.npmjs.com/package/js-yaml
