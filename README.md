# Full Stack Instagram App in Express.js and PostgreSQL

## Registration

You will need to register for an Instagram Developer Account and a Lob API Key

* [Lob Registration](https://dashboard.lob.com/#/register)
* [Instagram Registration](https://instagram.com/developer/?hl=en)


## Install Dependancies
```
npm i
```

## Run
```
node index.js
```

Visit `localhost:3000` in your browser


## instagram/.config.js
Configuration for Lob API Keys and Instagram Credentials

```
var config = {
  lob_api_key: 'xxxxx',
  instagram_redirect_uri: 'http://localhost:3000/handleauth',
  instagram_client_id: 'xxxxx',
  instagram_client_secret: 'xxxxx',
}

```


