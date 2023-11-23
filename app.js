const express = require('express');
const { router: userRouter  } = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use('/api/v1/circles', userRouter);


const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});