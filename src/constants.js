const CONTRACT_ADDRESS = '0xa45176d598d3A59A53ac32Fc2E01853c95364550';

const transformCharacterData = (txn) => {
    return {
        name: txn.name,
        image: txn.imageURI,
        hp: txn.hp.toNumber(),
        maxHp: txn.maxHp.toNumber(),
        attackDamage: txn.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };