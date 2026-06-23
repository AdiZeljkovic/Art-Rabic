const fs = require('fs');
const path = require('path');

const htmlDir = path.resolve(__dirname, '../../mikulicknjige');
const imgSrcDir = path.join(htmlDir, 'images', 'knjige');
const imgDestDir = path.resolve(__dirname, '../public/images/knjige');
const sqlOutputPath = path.resolve(__dirname, '../books-import.sql');

// Ensure destination image folder exists
if (!fs.existsSync(imgDestDir)) {
  fs.mkdirSync(imgDestDir, { recursive: true });
}

const files = fs.readdirSync(htmlDir)
  .filter(f => /^knjiga\d+\.html$/i.test(f))
  .sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
  });

console.log(`Found ${files.length} HTML files`);

const books = [];
const skipped = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(htmlDir, file), 'utf-8');

  // Title
  const titleMatch = html.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // Author — strip "Autor:" prefix if present, fallback to "Više autora"
  const authorMatch = html.match(/<h3[^>]*>\s*([^<]+?)\s*<\/h3>/i);
  const author = (authorMatch && authorMatch[1].trim())
    ? authorMatch[1].replace(/^Autor:\s*/i, '').trim()
    : 'Više autora';

  // Price — handle both "10.00" and "10,00" formats
  const priceMatch = html.match(/Cijena:\s*([\d]+[.,][\d]+)/i);
  const price = priceMatch
    ? parseFloat(priceMatch[1].replace(',', '.'))
    : 0;

  // Image
  const imgMatch = html.match(/src="images\/knjige\/([^"]+)"/i);
  const imageFile = imgMatch ? imgMatch[1] : null;

  // Description — content of <p> inside .product-detail
  const descMatch = html.match(/class="product-detail"[\s\S]*?<\/br>\s*<\/br>\s*<p>([\s\S]*?)<\/p>/i);
  const description = descMatch
    ? descMatch[1].trim().replace(/\s+/g, ' ').replace(/'/g, "''")
    : null;

  if (!title) {
    skipped.push(file);
    continue;
  }

  // Copy image to public folder
  let imageUrl = null;
  if (imageFile) {
    const srcPath = path.join(imgSrcDir, imageFile);
    const destPath = path.join(imgDestDir, imageFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      imageUrl = `/images/knjige/${imageFile}`;
    }
  }

  books.push({
    title: title.replace(/'/g, "''"),
    author: author.replace(/'/g, "''"),
    price,
    imageUrl,
    description,
  });
}

console.log(`Parsed: ${books.length} books | Skipped: ${skipped.length}`);
if (skipped.length > 0) console.log('Skipped files:', skipped.join(', '));

// Generate SQL
const lines = [
  '-- Art Rabic book import',
  `-- Generated: ${new Date().toISOString()}`,
  `-- Total: ${books.length} books`,
  '',
  'SET NAMES utf8mb4;',
  '',
  'INSERT INTO `Book` (`title`, `author`, `price`, `imageUrl`, `description`, `inStock`, `featured`, `createdAt`, `updatedAt`) VALUES',
];

const values = books.map((b, i) => {
  const img = b.imageUrl ? `'${b.imageUrl}'` : 'NULL';
  const desc = b.description ? `'${b.description}'` : 'NULL';
  return `  ('${b.title}', '${b.author}', ${b.price.toFixed(2)}, ${img}, ${desc}, 1, 0, NOW(), NOW())`;
});

lines.push(values.join(',\n') + ';');
lines.push('');
lines.push(`SELECT COUNT(*) AS imported_books FROM \`Book\`;`);

fs.writeFileSync(sqlOutputPath, lines.join('\n'), 'utf8');

console.log(`\nSQL written to: ${sqlOutputPath}`);
console.log(`Images copied to: ${imgDestDir}`);
console.log('\nSample entries:');
books.slice(0, 3).forEach(b => console.log(`  "${b.title}" — ${b.author} — ${b.price} KM`));
