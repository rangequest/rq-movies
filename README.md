# RQ Movies

Node | _Express_ | Mongo | bcrypt | Mongoose | Winston | JWT

_REST API implementing CRUD_

- Data persistance
- Authentication
- Authorization

## Push changes to Heroku

```
git push heroku master

//view logs
heroku logs
```

## Visit the deployed application

https://rq-movies.herokuapp.com/

```
heroku open
```

## Mongo Config

```
heroku config:set rqMoviesDb=mongodb://<username>:<password>...
```

# Google Compute Engine Deployment

```
// Backend
git clone https://github.com/rangequest/rq-movies.git

// Frontend
git clone https://github.com/rangequest/rq-react-movies.git

// Docker Compose Up!
cd rq-movies
docker-compose up
```
