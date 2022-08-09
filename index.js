const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

app.use('*', cors());
app.use(bodyParser.json());
const _secretKey = 'sdfdssdfsdf456s13s1df65165s1af31';
const _userList = [{ id: 1, email: 'narendra@gmail.com', password: 'password', name: 'Narendra Singh', dob: '2012-12-12' }];

app.get('/', (req, res) => {
    res.send("API is up and running.");
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const userDetail = _userList.find(i => i.email === email && i.password === password);
    if (userDetail) {
        const payload = { id: userDetail.id };
        const token = jwt.sign(payload, _secretKey, { expiresIn: -(60 * 60) });
        res.send({ status: 'success', token })
    } else {
        res.send({ status: 'failed', message: 'user not found' })
    }
})

const verifyToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (authorization) {
        const tokenBearer = authorization.split(' ');
        const token = tokenBearer[1];

        jwt.verify(token, _secretKey, function (err, decoded) {
            if (err) {
                res.status(403).send({ status: 'error', message: err.message })
            } else {
                req.tokenUserId = decoded.id;
                next();
            }
        })
    } else {
        res.status(403).send({ status: 'error', message: 'token not found' })
    }
}

app.get('/detail', verifyToken, (req, res) => {
    const tokenUserId = req.tokenUserId;
    const detail = _userList.find(i => i.id === tokenUserId);
    res.send({ status: 'success', detail })
})

app.listen(process.env.PORT || 8080, () => {
    console.log('API is up and running');
})