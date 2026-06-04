const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const csvFilePath = path.join(__dirname, '../../..', 'Dataset Nutrisi Makanan (2).csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    process.exit(1);
  }

  const foods = [];

  console.log('Reading CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // row format: nama,kalori,lemak,karbohidrat,protein
        if (row.nama && row.kalori) {
          foods.push({
            name: row.nama.trim(),
            calories: parseFloat(row.kalori) || 0,
            fat: parseFloat(row.lemak) || 0,
            carbs: parseFloat(row.karbohidrat) || 0,
            protein: parseFloat(row.protein) || 0,
          });
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${foods.length} food items.`);
        try {
          // Optional: Clear existing foods to avoid duplicates if run multiple times
          console.log('Clearing existing foods...');
          await prisma.food.deleteMany();
          
          console.log('Inserting into database...');
          const result = await prisma.food.createMany({
            data: foods,
          });
          console.log(`Successfully seeded ${result.count} food items.`);
          resolve();
        } catch (error) {
          console.error('Error seeding data:', error);
          reject(error);
        } finally {
          await prisma.$disconnect();
        }
      });
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
