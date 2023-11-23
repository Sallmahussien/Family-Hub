const { prisma } = require('../../client.db');

async function deleteFeedByFeedId (feedId) {

    await deleteLikesByFeedId(feedId);
    await deleteCommentsByFeedId(feedId);

    await prisma.feeds.update({
        where: {
            id: feedId,
            deleted: false
        },
        data: {
            deleted: true
        }
    });
}

async function deleteCommentsByFeedId (feedId) {
    const commentsIds = await prisma.comments.findMany({
        select: {
            id: true
        },
        where: {
            feedId: feedId,
            deleted: false
        }
    });

    const commentsIdsList = commentsIds.map((comment) => comment.id);

    await prisma.comments.updateMany({
        where: {
            id: {
                in: commentsIdsList
            }
        },
        data: {
            deleted: true
        }
    });
}

async function deleteLikesByFeedId (feedId) {
    const likesIds = await prisma.likes.findMany({
        select: {
            id: true
        },
        where: {
            feedId: feedId,
            deleted: false
        }
    });

    const likesIdsList = likesIds.map((like) => like.id);

    await prisma.likes.updateMany({
        where: {
            id: {
                in: likesIdsList
            }
        },
        data: {
            deleted: true
        }
    });
}

module.exports = { deleteFeedByFeedId };