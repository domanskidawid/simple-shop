import express from 'express';

const app = express();
const port = 3000;

// Middleware do parsowania JSON w ciele żądania
app.use(express.json());

// "Baza danych" w pamięci
let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
];
const welcome = {status: 'ok'}

app.get('/', (req, res) => {
    res.status(200).json(welcome);
})

// Endpoint do pobierania wszystkich użytkowników
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Endpoint do pobierania jednego użytkownika po ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.status(200).json(user);
});

// Endpoint do tworzenia nowego użytkownika
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Endpoint do aktualizacji użytkownika
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    res.status(200).json(user);
});

// Endpoint do usuwania użytkownika
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }

    const deletedUser = users.splice(userIndex, 1);
    res.status(200).json(deletedUser[0]);
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
