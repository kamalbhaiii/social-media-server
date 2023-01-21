const removePostFromUser = (userPostArr, id) => {
    const index = userPostArr.indexOf(id);
    if (index > -1) {
        userPostArr.splice(index, 1)
    }

    return userPostArr;
}

module.exports = {
    removePostFromUser
}