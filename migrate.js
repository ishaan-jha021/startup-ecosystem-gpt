const fs = require('fs');

const csv = fs.readFileSync('temp_data.csv', 'utf8');

const parseCSVRow = (str) => {
    const result = [];
    let insideQuotes = false;
    let currentWord = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"' && str[i + 1] === '"') {
            currentWord += '"'; i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(currentWord);
            currentWord = '';
        } else {
            currentWord += char;
        }
    }
    result.push(currentWord);
    return result.map(s => s.trim().replace(/^"|"$/g, ''));
};

const lines = csv.split('\n').filter(l => l.trim().length > 0);
const headers = parseCSVRow(lines[0]);

const data = lines.slice(1).map(line => {
    const values = parseCSVRow(line);
    const obj = {};
    headers.forEach((h, i) => {
        obj[h] = values[i] || '';
    });
    return obj;
});

const generateId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const mappedData = data.map(d => ({
    id: generateId(d['Name']),
    name: d['Name'],
    type: d['Type'],
    area: d['Address'],
    contactDetails: d['Contact & Website'],
    incubationExperience: d['Startups Incubated'],
    lastFiveIncubations: d['Notable Portfolio'],
    equityTaken: d['Equity Taken'],
    fee: d['Fee'],
    fundingGuarantee: d['Funding Guarantee'],
    investorAccess: d['Investor Access'],
    confHallCapacity: d['Conf. Hall Capacity'],
    callBooths: d['Call Booths'],
    seatingScalability: d['Seating Scalability'],
    programStructure: d['Program Structure'],
    brandValue: d['Brand Value'],
    idealStage: d['Ideal Stage'],
    founderFreedom: d['Founder Freedom'],
    timeLockIn: d['Time Lock-in']
}));

const moduleString = `export const westernLineData = ${JSON.stringify(mappedData, null, 4)};\n`;
fs.writeFileSync('lib/data/western_line.js', moduleString);
console.log('Successfully wrote ' + mappedData.length + ' records to lib/data/western_line.js');
