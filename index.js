const { error } = require("console");
const https = require("https");

function fetchGitHubActivity(username) {
    const url = `https://api.github.com/users/${username}/events`;

    https.get(url, {headers: {'User-Agent': 'Node.js'} }, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                const events = JSON.parse(data);
                displayActivity(events);
            } else {
                console.error(`Error: Unable to fetch activity for user "${username}". Status Code: ${response.statusCode}`);
            }
        });
    }).on('error', (error) => {
        console.error(`Error: Failed to fetch data from GitHub API. ${error.message}`);
    });
}

function displayActivity(events) {
    if (events.length === 0) {
        console.log('No recent activity found.');
        return;
    }

    console.log('Recent GitHub Activity:');
    events.forEach((event) => {
        switch (event.type) {
            case 'PushEvent':
                console.log(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
                break;
        
            case 'IssuesEvent':
                console.log(`- ${event.payload.action} an issue in ${event.repo.name}`);
                break;
            case 'WatchEvent':
                console.log(`- Starred ${event.repo.name}`);
                break;
            default:
                console.log(`- Performed an action of type "${event.type}" in ${event.repo.name}`);
        }
    });
}

function main() {
    const username = process.argv[2];

    if (!username) {
        console.error('Error: Please provide a GitHub username as an argument');
        console.log('Usage: node index.js <username>');
        process.exit(1);
    }

    fetchGitHubActivity(username);
}

main();