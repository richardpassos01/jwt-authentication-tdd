const bcrypt = require('bcryptjs');
const {User} = require('../../src/app/models');
const truncate = require('../utils/truncate');

describe('User', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should encrypt user password', async () => {
        const user = await User.create({
            name: 'richard', 
            email:'ric', 
            password:'123456'
        });

        const comparehash = await bcrypt.compare('123456', user.password_hash);

        expect(comparehash).toBe(true);
    });
});