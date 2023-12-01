const express = require('express');


const { router: circleRouter } = require('./routes/circle.routes');
const { router: contactBooksRouter } = require('./routes/contactBook.routes');
const { router: commentsRouter } = require('./routes/comment.routes');
const { router: eventsRouter } = require('./routes/event.routes');
const { router: usersRouter  } = require('./routes/user.routes');
const { router: postsRouter } = require('./routes/post.routes');
const { router: feedsRouter } = require('./routes/feed.routes');
const { router: GalleryRouter } = require('./routes/gallery.routes');
const { router: likesRouter } = require('./routes/like.routes');
const { router: listsRouter } = require('./routes/list.routes');
const { router: listItemsRouter } = require('./routes/listitem.routes');

const { router: authRouter } = require('./routes/auth.routes');

const app = express();

app.use(express.json());

// circle routes
app.use('/api/v1/circles', circleRouter);
app.use('/api/v1/circles', contactBooksRouter);
app.use('/api/v1/circles', commentsRouter);
app.use('/api/v1/circles', eventsRouter);
app.use('/api/v1/circles', feedsRouter);
app.use('/api/v1/circles', likesRouter);
app.use('/api/v1/circles', GalleryRouter);
app.use('/api/v1/circles', listsRouter);
app.use('/api/v1/circles', listItemsRouter);
app.use('/api/v1/circles', postsRouter);
app.use('/api/v1/circles', usersRouter);

// auth routes
app.use('/api/v1/auth', authRouter);


const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});