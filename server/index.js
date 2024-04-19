if (!process.env.NODE_ENV) {
    require('dotenv').config();
}
const express = require('express')
const {RESULT_CODES, RESULT_STATUSES} = require('./src/constants');
const app = express();
const router = require('./src/routes');


app.use('/api', router);
app.get('/', (req, res) => {
    res.status(200).json({
        resultCode: RESULT_CODES.SUCCESS,
        resultStatus: RESULT_STATUSES.SUCCESS,

    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
});