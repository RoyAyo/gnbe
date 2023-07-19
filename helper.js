// const Chance = require('chance')

// const chance = Chance();

const assignGroups = (users) => {
    const updatedUsers = []
    const groups = [];
    const groupMembers = [];
    for (let index = 0; index < 8; index++) {
        groups.push(0);
        groupMembers.push([]);
    }

    const usersLength = users.length;

    const memberPerGroup = Math.floor(usersLength / 8);

    const k = memberPerGroup * 8;
    const n_left = usersLength - k

    const n_groups = []
    for (let j = 0; j < n_left; j++) {
        n_groups.push(0)
    }

    for (let index = 0; index < users.length; index++) {
        const isRandom = index < k
        const number = getRandomGroup(!isRandom ? n_groups : groups, !isRandom ? 1 : memberPerGroup)
        
        const user = users[index]
        updatedUsers.push( {
            name: user.name,
            code: user.code,
            group: number
        })
        if(isRandom) {
            groups[number - 1] = groups[number - 1] + 1
        } else {
            groups[number - 1] = groups[number - 1] + 1
            n_groups[number - 1] = n_groups[number - 1] + 1
        }
        groupMembers[number - 1].push(index)
    }

    const shuffledTo = "74268135";

    let fake_index = 0;
    for(let groupMember of groupMembers) {
        const x = Math.floor(Math.random() * groupMember.length);
        const m = groupMember[x];
        updatedUsers[m] = {
            ...updatedUsers[m],
            fakeGroup: Number(shuffledTo[fake_index]),
            isFake: true
        }
        fake_index++
    }

    return updatedUsers
}

const getRandomGroup = (groups, numberPerGroup) => {
    let number = Math.ceil(Math.random() * 8);
    if(groups[number - 1] >= numberPerGroup) {
        number = getRandomGroup(groups, numberPerGroup)
    }
    return number
}

const randomizeUsers = (users, n) => {
    if(n >= users.length) {
        return [];
    }
    const pusers = [];
    const taken = [];
    let index = 0;
    while(index < n) {
        const x = Math.floor(Math.random() * users.length);
        if(!taken.includes(x)) {
            pusers.push(users[x])
            taken.push(x)
            index++
        }
    }
    return pusers;
}

module.exports = {
    assignGroups,
    randomizeUsers
}

const users = []

const generateSeed = () => {
    const n = 20;
    for (let index = 0; index < 5; index++) {
        users.push({
            name: chance.name(),
            code: chance.integer({min: 1000, max: 9999})
        })
    }
}


// // Test
// generateSeed()
// const test = randomizeUsers(users, 4)
// const test2 = randomizeUsers(users, 4)
// // const k = assignGroups(users);
// console.log(test);
// console.log(test2);