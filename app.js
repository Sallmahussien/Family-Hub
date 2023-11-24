const express = require('express');

const { router: usersRouter  } = require('./routes/user.routes');
const { router: postsRouter } = require('./routes/post.routes');
const { router: feedsRouter } = require('./routes/feed.routes');
const { router: listsRouter } = require('./routes/list.routes');
const { router: listItemsRouter } = require('./routes/listitem.routes');

const app = express();

app.use(express.json());

app.use('/api/v1/circles', feedsRouter);
app.use('/api/v1/circles', listsRouter);
app.use('/api/v1/circles', listItemsRouter);
app.use('/api/v1/circles', postsRouter);
app.use('/api/v1/circles', usersRouter);


const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});