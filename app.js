const express = require('express');

const { router: userRouter  } = require('./routes/user.routes');
const { router: postsRouter } = require('./routes/post.routes')
const { router: feedsRouter } = require('./routes/feed.routes')

const app = express();

app.use(express.json());

app.use('/api/v1/circles', feedsRouter);
app.use('/api/v1/circles', postsRouter);
app.use('/api/v1/circles', userRouter);


const port = 50000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});