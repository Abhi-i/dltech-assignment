const https = require('https')
async function getStories(){
    try {
        let html = await getHtml();
        let stories = findLatestStories(html);
        return stories;
    } catch (e) {
        console.log(e);
        return "something went wrong."
    }
}
function getHtml() {
    return new Promise((resolve, reject) => {
        let apiReq = https.get("https://time.com", (res) => {
            if(res.statusCode != 200) return reject("Error in API.")
            let html = '';
            res.on('data', (chunk) => {
                html += chunk;
            })
    
            res.on('end', () => {
                return resolve(html);
            })
        })
    
        apiReq.on('error', (err) => reject(err.message));
    })
}
function findLatestStories(html){
    let stories = [];
    let initialIndex = html.indexOf(`<li class="latest-stories__item">`, 0)
    for(let startIndex = initialIndex; startIndex > 0;){
        let endIndex = html.indexOf(`</li>`, startIndex + 33)
        let chunk = html.substring(startIndex + 33, endIndex);
        startIndex = html.indexOf(`<li class="latest-stories__item">`, endIndex + 5)
        stories.push(extractStory(chunk))
        if(stories.length == 6) break;
    }
    return stories;
}

function extractStory(chunk) {
    let startIndex = chunk.indexOf(`href="`)
    let endIndex = chunk.indexOf(`">`, startIndex + 6);
    let link = "https://time.com" + chunk.substring(startIndex + 6, endIndex)
    startIndex = chunk.indexOf(`item-headline">`)
    endIndex = chunk.indexOf(`</h3>`, startIndex + 15)
    let title = chunk.substring(startIndex + 15, endIndex)
    startIndex = chunk.indexOf(`item-timestamp">`)
    endIndex = chunk.indexOf(`</time>`, startIndex + 16)
    let time = chunk.substring(startIndex + 16 + 17, endIndex-15)
return {title, link/*, time*/};
}

module.exports = getStories;
