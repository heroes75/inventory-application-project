function getAllCelebrities(req, res) {
    res.render('allCelebrities', {items: 'All items will be here'})
}

module.exports = {
    getAllCelebrities
}