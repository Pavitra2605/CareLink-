import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

try {
    const server = app.listen(PORT, () => {
        console.log(`✓ Simple server running on port  ${PORT}`);
    });
} catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
}
