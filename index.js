const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let token = null;

const ClientId = process.env.CLIENT_ID;
const ClientSecret = process.env.CLIENT_SECRET;
const Scopes = process.env.SCOPES;
const AuthorizeUrl = process.env.AUTHORIZE_URL;
const AccessTokenUrl = process.env.ACCESS_TOKEN_URL;
const RedirectUrl = process.env.REDIRECT_URL;

app.get('/', (req, res) => {
    var qs = `?response_type=code&scope=${Scopes}&client_id=${ClientId}&redirect_uri=${encodeURI(RedirectUrl)}`;
    res.redirect(`${AuthorizeUrl}${qs}`);
});

app.get('/oauth-callback', (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams()
    params.append('client_id', ClientId)
    params.append('client_secret', ClientSecret)
    params.append('code', code)
    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', encodeURI(RedirectUrl))

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    axios.post(`${AccessTokenUrl}`, params, config).
        then(res => res.data['access_token']).
        then(_token => {
            console.log('My token:', token);
            token = _token;
            res.json({ ok: 1, token: token, code, code });
        }).
        catch(err => res.status(500).json({ message: err.message }));
});


app.listen(3000);
console.log('App listening on port 3000');

