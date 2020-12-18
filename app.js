//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
	title: String,
	content: String
};

const Article = mongoose.model("Articulo", articleSchema);

app.route("/articulos")

	.get(function (req, res) {
		Article.find(function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})

	.post(function (req, res) {
		const nuevoArticulo = new Article({
			title: req.body.title,
			content: req.body.content
		});
		nuevoArticulo.save(function (err) {
			if (!err) {
				res.send("Se agrego correctamente el nuevo articulo");
			} else {
				res.send(err);
			}
		});
	})

	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("Se eliminaron correctamente todos los artculos");
			} else {
				res.send(err);
			}
		});
	});

app.route("/articulos/:tituloArticulo")

	.get(function (req, res) {
		Article.findOne({ title: req.params.tituloArticulo }, function (err, foundArticle) {
			if (!err) {
				res.send(foundArticle);
			} else {
				res.send("No se encontraron articulos que coincidan con ese titulo");
			}
		});
	})

	.put(function (req, res) {
		Article.update(
			{ title: req.params.tituloArticulo }, //parametros de busqueda
			{
				title: req.body.title, //los parametros que se van a actualizar
				content: req.body.content
			},
			{ overwrite: true }, //permiso para sobrescribir
			function (err) {
				if (!err) {
					res.send("Se actualizo correctamente el articulo");
				} else {
					res.send("No se logro actualizar el articulo");
				}
			}
		);
	})

	.patch(function (req, res) {
		Article.update(
			{ title: req.params.tituloArticulo },
			{ $set: req.body },
			function (err) {
				if (!err) {
					res.send("Se actualizo correctamente el articulo");
				} else {
					res.send(err);
				}
			}
		);
	})

	.delete(function (req, res) {
		Article.deleteOne(
			{ title: req.params.tituloArticulo },
			function (err) {
				if (!err) {
					res.send("Se elimino correctamente el articulo: " + req.params.tituloArticulo);
				} else {
					res.send(err);
				}
			}
		);
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});