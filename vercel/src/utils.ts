import shortid from 'shortid';

export default function generate1() {
    const generateUniqueId = shortid.generate();
    console.log(generateUniqueId);    
    return generateUniqueId
}
