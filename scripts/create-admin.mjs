import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { createInterface } from 'node:readline';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. Configure the root .env file first.');

function askLine(question) {
  const reader = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => reader.question(question, (answer) => { reader.close(); resolve(answer.trim()); }));
}

function askSecret(question) {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    throw new Error('Run this command in an interactive terminal so the password can be entered without echo.');
  }
  process.stdout.write(question);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stdout.write('\n');
      error ? reject(error) : resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') return finish(new Error('Cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character >= ' ') value += character;
      }
    };
    process.stdin.on('data', onData);
  });
}

const email = (await askLine('Owner email: ')).toLowerCase();
const fullName = await askLine('Owner display name: ');
const password = await askSecret('Password (12+ characters): ');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || password.length < 12) {
  throw new Error('Enter a valid email and display name; password must be at least 12 characters.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
try {
  const passwordHash = await hash(password, 12);
  const admin = await prisma.$transaction(async (tx) => {
    if (await tx.adminUser.count() > 0) throw new Error('An administrator already exists. Use the not-yet-implemented account management workflow to add more staff.');
    const created = await tx.adminUser.create({ data: { email, fullName, passwordHash, role: 'OWNER' } });
    await tx.auditLog.create({ data: { adminUserId: created.id, action: 'ADMIN_ACCOUNT_CREATED', entityType: 'AdminUser', entityId: created.id } });
    return created;
  }, { isolationLevel: 'Serializable' });
  process.stdout.write(`Initial owner account created for ${admin.email}.\n`);
} finally {
  await prisma.$disconnect();
}
