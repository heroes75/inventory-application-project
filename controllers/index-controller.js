function indexController(req, res) {
    res.render('index')
}

const celebrities = [
    {
        id: 1,
        name: "Rei Naoi",
        birthdate: "2004-02-03",
        description: "She soo beautiful",
        categoryId: 1
    },
    {
        id: 2,
        name: "Aeri Uchinaga",
        birthdate: "2000-10-30",
        description: "She soo beautiful too",
        categoryId: 1
    },
    {
        id: 3,
        name: "Kako d'Akishino",
        birthdate: "1994-12-29",
        description: "princess of japan",
        categoryId: 2
    }
]

const categories = [
    {
        id: 1,
        name: 'Music' 
    },
    {
        id: 2,
        name: "politics"
    }
]

module.exports = {
    indexController,
    celebrities,
    categories,
}