const findFriendAndRemove = (friendsArr, id) => {
    const index = friendsArr.indexOf(id);
    if (index > -1) {
        friendsArr.splice(index, 1)
    }

    return friendsArr;
}

module.exports = {
    findFriendAndRemove
}