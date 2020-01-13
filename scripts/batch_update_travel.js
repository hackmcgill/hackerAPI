use hackboard - dev; // Change to product for actual update

// Create a travel document for every hacker document
db.hackers.find().forEach(hacker => {
    let request = 0;
    if (hacker.application && hacker.application.accommodation && hacker.application.accommodation.travel) {
        request = hacker.application.accommodation.travel;
    }
    db.travels.insert({ hackerId: hacker._id, accountId: hacker.accountId, request: request, offer: 0, status: "None" })
});
