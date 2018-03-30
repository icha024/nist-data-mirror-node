const fetch = require('node-fetch');
const fs = require('fs');
const baseUrl = 'https://nvd.nist.gov/feeds'

urlPaths = ['/xml/cve/1.2/nvdcve-modified.xml.gz',
    '/xml/cve/2.0/nvdcve-2.0-modified.xml.gz',
    '/json/cve/1.0/nvdcve-1.0-modified.json.gz']

urlPathsWithYear = ['/xml/cve/1.2/nvdcve-{{year}}.xml.gz',
    '/xml/cve/2.0/nvdcve-2.0-{{year}}.xml.gz',
    '/json/cve/1.0/nvdcve-1.0-{{year}}.json.gz']

const getFileName = fileName => {
    const fileNameSplit = fileName.split('/')
    return fileNameSplit[fileNameSplit.length - 1]
}
const downloads = urlPaths.map(eachPath => {
    console.log(`EACH PATH: ${eachPath}`)
    const fullPath = baseUrl + eachPath
    const fileName = getFileName(fullPath)
    return { fullPath, fileName }
})

const startYear = 2002
const endYear = 2018

for (let eachPathIdx in urlPathsWithYear) {
    const eachPath = urlPathsWithYear[eachPathIdx]
    for (let year = startYear; year <= endYear; year++) {
        const eachPathWithYear = eachPath.replace('{{year}}', year)
        const fullPath = baseUrl + eachPathWithYear
        const fileName = getFileName(fullPath)

        downloads.push({ fullPath, fileName });
    }
}

const dir = 'nist-data';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const fetchData = item => fetch(item.fullPath)
    .then(res => {
        if (res.ok) {
            const dest = fs.createWriteStream(`${dir}/${item.fileName}`);
            res.body.pipe(dest);
            console.log(`Downloaded ${item.fileName}`)
        } else {
            console.log(`Can not find ${item.fileName}, res: ${JSON.stringify(res.status)}`)
        }
    })
    .catch(error => console.log(`Can not download: ${error}`))

// downloads.map(item => console.debug(`${item.fullPath} =====> ${dir}/${item.fileName}`))

// Serialise it. Going too fast will result in 403: Forbidden.
const firstDownload = downloads.pop()
downloads.reduce((prev, cur) => {
    console.log(`Will download: ${item.fullPath} to ${dir}/${item.fileName}`)
    return prev.then(() => fetchData(cur))
}, fetchData(firstDownload));
