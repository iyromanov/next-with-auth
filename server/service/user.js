const USER = { id: 1, name: 'Igor' };

class User {
    static findOne(username, password) {
        if (username === password) {
            return Promise.resolve(USER);
        } else {
            return Promise.reject({ message: 'Invalid password' });
        }
    }

    static findById() {
        return Promise.resolve(USER);
    }
}

module.exports = User; 