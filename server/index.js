if (!process.env.NODE_ENV) {
	require('dotenv').config();
}
const express = require('express');
const { RESULT_CODES, RESULT_STATUSES, ENVIRONMENTS} = require('./src/common/constants');
const app = express();
const router = require('./src/routes');
const cors = require('cors');
const path = require('path');
const DBManager = require('./src/common/db-manager');


if (process.env.ENABLE_MONGO) {
	DBManager.connectToMongo().catch(() => {});
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === ENVIRONMENTS.LOCALHOST) {
	app.use(cors({ origin: '*' }));
}
app.use(express.json());
app.use('/api', router);

// FOR PRODUCTION:   cp -r client/build/* server/public/ - copy client build code to server
if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
	app.use(express.static(path.join(__dirname, "public")));
}

app.get('/', (req, res) => {
	if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
		return res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
	}
	res.status(200).json({
		resultCode: RESULT_CODES.SUCCESS,
		resultStatus: RESULT_STATUSES.SUCCESS
	});
});
app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
