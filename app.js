const express = require('express')
const { Module } = require('configs/Module')

const app = express()
const mod = new Module(app)
mod.cors()
mod.bodyParser()
mod.form()

module.exports = { app }
