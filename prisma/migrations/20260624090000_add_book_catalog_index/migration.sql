-- Indeks za stvarni upit kataloga: WHERE inStock = 1 ORDER BY createdAt DESC
-- Bez njega MySQL radi full table scan + filesort.
CREATE INDEX `Book_inStock_createdAt_idx` ON `Book`(`inStock`, `createdAt`);
