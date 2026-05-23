// Seeds the database from data.json. Idempotent — uses ON CONFLICT upserts.

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
);

async function seedSiteSettings(client) {
  const entries = [
    ['site',       data.site],
    ['navigation', data.navigation],
    ['footer',     data.footer],
    ['ui',         data.ui],
    ['seo',        data.seo],
    ['contacts',   data.contacts],
  ];
  for (const [key, value] of entries) {
    await client.query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );
  }
  console.log(`✓ Seeded site_settings (${entries.length} rows)`);
}

async function seedPages(client) {
  let count = 0;
  for (const [slug, content] of Object.entries(data.pages || {})) {
    await client.query(
      `INSERT INTO pages (slug, content) VALUES ($1, $2::jsonb)
       ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
      [slug, JSON.stringify(content)]
    );
    count++;
  }
  console.log(`✓ Seeded pages (${count} rows)`);
}

async function seedCategoriesAndProducts(client) {
  let catCount = 0;
  let prodCount = 0;

  for (let i = 0; i < data.productCategories.length; i++) {
    const cat = data.productCategories[i];

    await client.query(
      `INSERT INTO categories (id, slug, name, description, icon, image, sort_order)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE
       SET slug = EXCLUDED.slug,
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           icon = EXCLUDED.icon,
           image = EXCLUDED.image,
           sort_order = EXCLUDED.sort_order`,
      [
        cat.id,
        cat.slug,
        JSON.stringify(cat.name),
        cat.description ? JSON.stringify(cat.description) : null,
        cat.icon || null,
        cat.image || null,
        i,
      ]
    );
    catCount++;

    const products = cat.products || [];
    for (let j = 0; j < products.length; j++) {
      const p = products[j];
      const {
        id, name, code, applications, description, image,
        ...rest
      } = p;

      await client.query(
        `INSERT INTO products
           (id, category_id, name, code, applications, description, specs, image, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9)
         ON CONFLICT (id) DO UPDATE
         SET category_id = EXCLUDED.category_id,
             name = EXCLUDED.name,
             code = EXCLUDED.code,
             applications = EXCLUDED.applications,
             description = EXCLUDED.description,
             specs = EXCLUDED.specs,
             image = EXCLUDED.image,
             sort_order = EXCLUDED.sort_order`,
        [
          id,
          cat.id,
          name,
          code || null,
          applications || null,
          description ? JSON.stringify(description) : null,
          JSON.stringify(rest),
          image || null,
          j,
        ]
      );
      prodCount++;
    }
  }
  console.log(`✓ Seeded categories (${catCount}) and products (${prodCount})`);
}

async function seedNews(client) {
  for (const n of data.news) {
    await client.query(
      `INSERT INTO news (id, slug, date, title, excerpt, content, image, published)
       VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7, TRUE)
       ON CONFLICT (id) DO UPDATE
       SET slug = EXCLUDED.slug,
           date = EXCLUDED.date,
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           content = EXCLUDED.content,
           image = EXCLUDED.image`,
      [
        n.id,
        n.slug,
        n.date,
        JSON.stringify(n.title),
        n.excerpt ? JSON.stringify(n.excerpt) : null,
        n.content ? JSON.stringify(n.content) : null,
        n.image || null,
      ]
    );
  }
  console.log(`✓ Seeded news (${data.news.length} rows)`);
}

async function seedPartners(client) {
  await client.query('TRUNCATE partners RESTART IDENTITY');
  for (let i = 0; i < data.partners.length; i++) {
    const p = data.partners[i];
    await client.query(
      `INSERT INTO partners (name, logo, url, sort_order) VALUES ($1, $2, $3, $4)`,
      [p.name, p.logo || null, p.url || null, i]
    );
  }
  console.log(`✓ Seeded partners (${data.partners.length} rows)`);
}

async function seedContactDepartments(client) {
  await client.query('TRUNCATE contact_departments');
  const depts = data.contacts.departments || [];
  for (let i = 0; i < depts.length; i++) {
    const d = depts[i];
    await client.query(
      `INSERT INTO contact_departments (id, name, phones, sort_order)
       VALUES ($1, $2::jsonb, $3, $4)`,
      [d.id, JSON.stringify(d.name), d.phones, i]
    );
  }
  console.log(`✓ Seeded contact_departments (${depts.length} rows)`);
}

async function seedContactDealers(client) {
  await client.query('TRUNCATE contact_dealers RESTART IDENTITY');
  const dealers = data.contacts.dealers || [];
  for (let i = 0; i < dealers.length; i++) {
    const d = dealers[i];
    await client.query(
      `INSERT INTO contact_dealers (region, phone, sort_order)
       VALUES ($1::jsonb, $2, $3)`,
      [JSON.stringify(d.region), d.phone, i]
    );
  }
  console.log(`✓ Seeded contact_dealers (${dealers.length} rows)`);
}

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await seedSiteSettings(client);
    await seedPages(client);
    await seedCategoriesAndProducts(client);
    await seedNews(client);
    await seedPartners(client);
    await seedContactDepartments(client);
    await seedContactDealers(client);
    await client.query('COMMIT');
    console.log('\n✅ Seed completed');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
