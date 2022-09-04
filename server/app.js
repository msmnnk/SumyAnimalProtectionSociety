const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const imagesPath = '../views/resources/images';
const multer  = require('multer');
const upload = multer({ dest: imagesPath });

const mongoose = require('mongoose');
const Config = require('./Config');
const requestController = require('./controllers/requestController');
const shelterController = require('./controllers/shelterController');

app.use('/resources', express.static('../views/resources'));
app.use('/styles', express.static('../views/styles'));
app.use('/scripts', express.static('../views/scripts'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(Config.DBConnectUri);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/api/loadPhoto', upload.single('file'), (req, res) => {
	const file = req.file;
	let fileExtension = req.file.originalname.split('.').pop();
	fs.rename(imagesPath + '/' + file.filename, imagesPath + '/' + file.filename + '.' + fileExtension, (err) => {
		res.status(400).send();
	});
	res.status(200).send({status: 'ok', fileUrl: 'resources/images/' + file.filename + '.' + fileExtension});
});

app.post('/api/deleteShelter', (req, res) => {
	if (req.headers.authorization === Config.AdminToken) {
		shelterController.deleteShelter(req.body.id).then(() => {
			res.status(200).send({status: 'ok'});
		}).catch((err) => {
			res.status(400).send({status: 'error', error: err});
		});
	} else {
		res.status(400).send({status: 'error', error: 'Не авторизовано'});
	}
});

app.post('/api/addShelter', (req, res) => {
	if (req.headers.authorization === Config.AdminToken) {
		shelterController.createNew(req.body).then((shelter) => {
			res.status(200).send({status: 'ok', shelter: shelter});
		}).catch((err) => {
			res.status(400).send({status: 'error', error: err});
		});
	} else {
		res.status(400).send({status: 'error', error: 'Не авторизовано'});
	}
});

app.get('/api/getShelters', (req, res) => {
	if (req.headers.authorization === Config.AdminToken) {
		shelterController.getAll().then(data => {
			res.status(200).send({status: 'ok', shelters: data});
		}).catch(err => {
			res.status(400).send({status: 'error'});
		});
	} else {
		res.status(400).send({status: 'error'});
	}
});

app.get('/api/getShelterById', (req, res) => {
	shelterController.getById(req.query.id).then(data => {
		res.status(200).send({status: 'ok', shelter: data});
	}).catch(err => {
		res.status(400).send({status: 'error'});
	});
});

app.post('/api/updateRequest', (req, res) => {
	if (req.headers.authorization === Config.AdminToken) {
		requestController.updateRequest(req.body)
		.then(data => {
			res.status(200).send({status: 'ok'});
		})
		.catch(err => {
			res.status(400).send({status: 'error'});
		});
	} else {
		res.status(401).send({status: 'error'});
	}
});

app.post('/api/deleteRequest', (req, res) => {
	if (req.headers.authorization === Config.AdminToken) {
		requestController.deleteRequest(req.body.id)
		.then(() => {
			res.status(200).send({status: 'ok'});
		})
		.catch((err) => {
			res.status(400).send({status: 'error'});
		});
	} else {
		res.status(401).send({status: 'error'});
	}
});

app.post('/api/submitRequest', (req, res) => {
	if (req.body) {
		requestController.createNew(req.body).then(() => {
			res.status(200).send({status: 'ok'});
		}).catch((err) => {
			res.status(400).send({err: err});
		});
	} else {
		res.status(400).send({status: 'error'});
	}
});

app.get('/api/getAllRequests', (req, res) => {
	requestController.getAll().then((requests) => {
		res.status(200).send({status: 'ok', requests: requests});
	}).catch((err) => {
		res.status(400).send({status: 'error'});
	});
});

app.post('/api/login', (req, res) => {
	if (req.body.username === Config.AdminLogin && req.body.password === Config.AdminPass) {
		res.status(200).send({status: 'ok', token: Config.AdminToken});
	} else {
		res.status(400).send({status: 'error'});
	}
});

app.post('/api/checkToken', (req, res) => {
	if (req.body.token === Config.AdminToken) {
		res.status(200).send({status: 'ok'});
	} else {
		res.status(401).send({status: 'unauthorized'});
	}
});

app.get('/admin', (req, res) => {
	res.sendFile(path.join(__dirname, '../views/admin.html'));
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})