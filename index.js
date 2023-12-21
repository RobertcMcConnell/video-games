const pg = require('pg')
const client = new pg.Client('postgres://localhost/games')
const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/videogames', async (req,res,nest) => {
    try {
        const SQL = `
        SELECT *
        FROM videogames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
    
})

app.get('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
        SELECT *
        FROM videogames
        WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.delete('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL =`
        DELETE
        FROM videogames
        WHERE id =$1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(204)
    } catch (error) {
        next(error)
    }
})

app.post('/api/videogames', async (req,res,next) => {
    try {
        const SQL = `
        INSERT INTO videogames (name, rating)
        VALUES($1, $2)
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.rating])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.put('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL =`
        UPDATE videogames
        SET name =$1, rating =$2
        WHERE id =$3
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.rating, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * 
        FROM boardgames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * 
        FROM boardgames
        WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.delete('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
        DELETE
        FROM boardgames
        WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(204)
    } catch (error) {
        next(error)
    }
})

app.post('/api/boardgames', async (req,res,next) => {
    try {
        const SQL = `
        INSERT INTO boardgames(name,img)
        VALUES($1, $2)
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.img])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.put('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL =`
        UPDATE boardgames
        SET name =$1, img =$2
        WHERE id =$3
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.img, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})



const start = async () => {
    await client.connect()
    console.log('connect to db')
    const SQL = `
        DROP TABLE IF EXISTS videogames;
        DROP TABLE IF EXISTS boardgames;

        CREATE TABLE boardgames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            img VARCHAR(500)
        );
        INSERT INTO boardgames (name, img) VALUES ('catan', 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000068417/f75365bce6cbfbf0e1678f1ce87fe8631234b505149e22a93464120bd8f9b98a');
        INSERT INTO boardgames (name, img) VALUES ('monopoly', 'https://rmconservancy.org/wp-content/uploads/2020/04/Monopoly-1000x1000.png');
        INSERT INTO boardgames (name, img) VALUES ('thrillist', 'https://assets3.thrillist.com/v1/image/2913581/1000x666/flatten;crop;webp=auto;jpeg_quality=60.jpg');
        INSERT INTO boardgames (name, img) VALUES ('jenga', 'https://shop.redwoodparksconservancy.org/cdn/shop/products/JengaNationalParks1.jpg?v=1671207055');
        INSERT INTO boardgames (name, img) VALUES ('pylos', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGiDMrPOOvYzQQXyopSvDS-9zv3gISEWH0YA&usqp=CAU');
        INSERT INTO boardgames (name, img) VALUES ('ticket to ride', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiLNo962iwdYY10ArQX9Nm5ga7oyjiTNcd6Q&usqp=CAU');

        CREATE TABLE videogames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            rating INT
        );
        INSERT INTO videogames (name, rating) VALUES ('superMario', 2);
        INSERT INTO videogames (name, rating) VALUES ('conkers bad fur day',3);
        INSERT INTO videogames (name, rating) VALUES ('mario cart', 2);
        INSERT INTO videogames (name, rating) VALUES ('mario pill stack', 1);
        INSERT INTO videogames (name, rating) VALUES ('duck hunt', 1);
        INSERT INTO videogames (name, rating) VALUES ('battletoads',1);
    `
    await client.query(SQL)
    console.log("table created and seeded")

    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log(`app running on port ${port}`)
    })
}
start()