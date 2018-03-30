const fetch = require('node-fetch');
const fs = require('fs');
const baseUrl = 'https://nvd.nist.gov/feeds'

urlPaths = ['/xml/cve/1.2/nvdcve-modified.xml.gz',
    '/xml/cve/2.0/nvdcve-2.0-modified.xml.gz',
    '/json/cve/1.0/nvdcve-1.0-modified.json.gz']

urlPathsWithYear = ['/xml/cve/1.2/nvdcve-{{year}}.xml.gz',
    '/xml/cve/2.0/nvdcve-2.0-{{year}}.xml.gz',
    '/json/cve/1.0/nvdcve-1.0-{{year}}.json.gz']

const startYear = 2010
const endYear = 2018
const downloads = []

const getFileName = fileName => {
    const fileNameSplit = fileName.split('/')
    return fileNameSplit[fileNameSplit.length - 1]
}

for (let eachPathIdx in urlPathsWithYear) {
    const eachPath = urlPathsWithYear[eachPathIdx]
    for (let year = startYear; year <= endYear; year++) {
        const eachPathWithYear = eachPath.replace('{{year}}', year)
        const fullPath = baseUrl + eachPathWithYear
        const fileName = getFileName(fullPath)

        downloads.push({ fullPath, fileName });
    }
}

for (let eachPathIdx in urlPaths) {
    const eachPath = urlPaths[eachPathIdx]
    const fullPath = baseUrl + eachPath
    const fileName = getFileName(fullPath)
    downloads.push({ fullPath, fileName });
}

const dir = 'nist-data';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

downloads.map(item => {
    console.log(`Will download: ${item.fullPath} =====> ${dir}/${item.fileName}`)
    return item
}).map(item => fetch(item.fullPath)
    .then(res => {
        const dest = fs.createWriteStream(`${dir}/${item.fileName}`);
        res.body.pipe(dest);
    }))
