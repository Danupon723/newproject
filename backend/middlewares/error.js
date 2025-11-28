module.exports = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || 'inserver EORR'
    res.status(status).json({ message })
}