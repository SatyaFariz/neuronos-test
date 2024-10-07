const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker')


function addMessage() {
  const dbPath = path.join(__dirname, 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const newMessage = {
    id: faker.string.uuid(),
    incrementId: db.messages.length + 1,
    content: faker.lorem.sentence(),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    timestamp: new Date().toISOString(),
    read: false
  };
  
  db.messages.unshift(newMessage);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('New message added:', newMessage);
}

setInterval(addMessage, 60000);